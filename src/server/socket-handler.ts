// ============================================================================
// Socket.io Handler - Real-time Chat, Progress Feed & Presence System
// ============================================================================

import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

// ============================================================================
// Types
// ============================================================================

interface UserSocket {
  id: string;
  clerkId: string;
  username: string;
  avatarUrl?: string;
}

interface RoomMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderUsername: string;
  senderAvatar?: string;
  content: string;
  messageType: "TEXT" | "CODE" | "IMAGE" | "SYSTEM";
  codeSnippet?: string;
  codeLanguage?: string;
  createdAt: Date;
}

interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
}

interface ProgressUpdate {
  userId: string;
  username: string;
  avatarUrl?: string;
  problemId: string;
  problemTitle: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  platform: string;
  solvedAt: Date;
}

interface TypingEvent {
  userId: string;
  username: string;
  roomId?: string;
  receiverId?: string;
}

interface PresenceData {
  clerkId: string;
  username: string;
  status: "online" | "away" | "busy" | "offline";
  lastActiveAt: Date;
}

// ============================================================================
// Socket.io Server Class
// ============================================================================

export class SocketServer {
  private io: Server;
  private onlineUsers: Map<string, UserSocket> = new Map();
  private userSockets: Map<string, Set<string>> = new Map(); // clerkId -> socketIds

  constructor(httpServer: HTTPServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["websocket", "polling"],
    });

    this.initializeRedisAdapter();
    this.setupEventHandlers();
  }

  // ============================================================================
  // Redis Adapter (for horizontal scaling)
  // ============================================================================

  private async initializeRedisAdapter() {
    if (process.env.REDIS_URL) {
      try {
        const pubClient = createClient({ url: process.env.REDIS_URL });
        const subClient = pubClient.duplicate();

        await Promise.all([pubClient.connect(), subClient.connect()]);

        this.io.adapter(createAdapter(pubClient, subClient));
        console.log("✅ Socket.io Redis adapter connected");
      } catch (error) {
        console.error("❌ Redis adapter connection failed:", error);
      }
    }
  }

  // ============================================================================
  // Event Handlers Setup
  // ============================================================================

  private setupEventHandlers() {
    this.io.on("connection", (socket: Socket) => {
      console.log(`🔌 New connection: ${socket.id}`);

      // ========== Authentication ==========
      socket.on("authenticate", (user: UserSocket) => {
        this.handleAuthentication(socket, user);
      });

      // ========== Room Chat ==========
      socket.on("join-room", (roomId: string) => {
        this.handleJoinRoom(socket, roomId);
      });

      socket.on("leave-room", (roomId: string) => {
        this.handleLeaveRoom(socket, roomId);
      });

      socket.on(
        "room-message",
        (message: Omit<RoomMessage, "id" | "createdAt">) => {
          this.handleRoomMessage(socket, message);
        },
      );

      // ========== Direct Messages ==========
      socket.on(
        "direct-message",
        (message: Omit<DirectMessage, "id" | "createdAt">) => {
          this.handleDirectMessage(socket, message);
        },
      );

      // ========== Typing Indicators ==========
      socket.on("typing-start", (data: TypingEvent) => {
        this.handleTypingStart(socket, data);
      });

      socket.on("typing-stop", (data: TypingEvent) => {
        this.handleTypingStop(socket, data);
      });

      // ========== Presence ==========
      socket.on("update-presence", (status: PresenceData["status"]) => {
        this.handlePresenceUpdate(socket, status);
      });

      // ========== Disconnection ==========
      socket.on("disconnect", () => {
        this.handleDisconnect(socket);
      });
    });
  }

  // ============================================================================
  // Authentication Handler
  // ============================================================================

  private handleAuthentication(socket: Socket, user: UserSocket) {
    // Store user data on socket
    socket.data.user = user;

    // Add to online users
    this.onlineUsers.set(socket.id, user);

    // Track multiple sockets per user
    if (!this.userSockets.has(user.clerkId)) {
      this.userSockets.set(user.clerkId, new Set());
    }
    this.userSockets.get(user.clerkId)!.add(socket.id);

    // Join personal room for DMs
    socket.join(`user:${user.clerkId}`);

    // Broadcast presence update
    this.broadcastPresence(user.clerkId, "online");

    console.log(`✅ User authenticated: ${user.username} (${socket.id})`);

    // Send current online users to the connected user
    socket.emit("online-users", this.getOnlineUsersList());
  }

  // ============================================================================
  // Room Chat Handlers
  // ============================================================================

  private handleJoinRoom(socket: Socket, roomId: string) {
    const user = socket.data.user as UserSocket;
    if (!user) return;

    socket.join(`room:${roomId}`);

    // Notify room members
    socket.to(`room:${roomId}`).emit("user-joined-room", {
      roomId,
      user: {
        id: user.clerkId,
        username: user.username,
        avatarUrl: user.avatarUrl,
      },
    });

    // Send room members list to the joining user
    const roomMembers = this.getRoomMembers(roomId);
    socket.emit("room-members", { roomId, members: roomMembers });

    console.log(`📥 ${user.username} joined room: ${roomId}`);
  }

  private handleLeaveRoom(socket: Socket, roomId: string) {
    const user = socket.data.user as UserSocket;
    if (!user) return;

    socket.leave(`room:${roomId}`);

    // Notify room members
    socket.to(`room:${roomId}`).emit("user-left-room", {
      roomId,
      userId: user.clerkId,
      username: user.username,
    });

    console.log(`📤 ${user.username} left room: ${roomId}`);
  }

  private handleRoomMessage(
    socket: Socket,
    message: Omit<RoomMessage, "id" | "createdAt">,
  ) {
    const user = socket.data.user as UserSocket;
    if (!user) return;

    const fullMessage: RoomMessage = {
      ...message,
      id: this.generateId(),
      senderUsername: user.username,
      senderAvatar: user.avatarUrl,
      createdAt: new Date(),
    };

    // Broadcast to room
    this.io.to(`room:${message.roomId}`).emit("room-message", fullMessage);

    console.log(
      `💬 Room message in ${message.roomId}: ${message.content.substring(0, 50)}...`,
    );
  }

  // ============================================================================
  // Direct Message Handlers
  // ============================================================================

  private handleDirectMessage(
    socket: Socket,
    message: Omit<DirectMessage, "id" | "createdAt">,
  ) {
    const user = socket.data.user as UserSocket;
    if (!user) return;

    const fullMessage: DirectMessage = {
      ...message,
      id: this.generateId(),
      createdAt: new Date(),
    };

    // Send to receiver's personal room
    this.io.to(`user:${message.receiverId}`).emit("direct-message", {
      ...fullMessage,
      senderUsername: user.username,
      senderAvatar: user.avatarUrl,
    });

    // Send confirmation to sender
    socket.emit("message-sent", fullMessage);

    console.log(`📧 DM from ${user.username} to ${message.receiverId}`);
  }

  // ============================================================================
  // Typing Indicators
  // ============================================================================

  private handleTypingStart(socket: Socket, data: TypingEvent) {
    const user = socket.data.user as UserSocket;
    if (!user) return;

    if (data.roomId) {
      socket.to(`room:${data.roomId}`).emit("user-typing", {
        userId: user.clerkId,
        username: user.username,
        roomId: data.roomId,
      });
    } else if (data.receiverId) {
      this.io.to(`user:${data.receiverId}`).emit("user-typing", {
        userId: user.clerkId,
        username: user.username,
      });
    }
  }

  private handleTypingStop(socket: Socket, data: TypingEvent) {
    const user = socket.data.user as UserSocket;
    if (!user) return;

    if (data.roomId) {
      socket.to(`room:${data.roomId}`).emit("user-stopped-typing", {
        userId: user.clerkId,
        roomId: data.roomId,
      });
    } else if (data.receiverId) {
      this.io.to(`user:${data.receiverId}`).emit("user-stopped-typing", {
        userId: user.clerkId,
      });
    }
  }

  // ============================================================================
  // Presence System
  // ============================================================================

  private handlePresenceUpdate(socket: Socket, status: PresenceData["status"]) {
    const user = socket.data.user as UserSocket;
    if (!user) return;

    this.broadcastPresence(user.clerkId, status);
  }

  private broadcastPresence(clerkId: string, status: PresenceData["status"]) {
    const user = this.getUserByClerkId(clerkId);
    if (!user) return;

    this.io.emit("presence-update", {
      clerkId,
      username: user.username,
      status,
      lastActiveAt: new Date(),
    });
  }

  // ============================================================================
  // Disconnect Handler
  // ============================================================================

  private handleDisconnect(socket: Socket) {
    const user = socket.data.user as UserSocket;

    if (user) {
      // Remove socket from user's socket set
      const userSocketSet = this.userSockets.get(user.clerkId);
      if (userSocketSet) {
        userSocketSet.delete(socket.id);

        // If no more sockets, user is offline
        if (userSocketSet.size === 0) {
          this.userSockets.delete(user.clerkId);
          this.broadcastPresence(user.clerkId, "offline");
        }
      }
    }

    this.onlineUsers.delete(socket.id);
    console.log(`🔌 Disconnected: ${socket.id}`);
  }

  // ============================================================================
  // Public Methods (for API routes to call)
  // ============================================================================

  /**
   * Emit a live progress update when a user solves a problem
   * Called from API routes after problem is marked as solved
   */
  public emitProgressUpdate(update: ProgressUpdate, followerIds: string[]) {
    // Emit to global feed
    this.io.emit("global-progress", update);

    // Emit to specific followers
    followerIds.forEach((followerId) => {
      this.io.to(`user:${followerId}`).emit("follower-progress", update);
    });

    console.log(
      `🎯 Progress update: ${update.username} solved ${update.problemTitle}`,
    );
  }

  /**
   * Emit notification to a specific user
   */
  public emitNotification(
    userId: string,
    notification: {
      type: string;
      title: string;
      message: string;
      linkUrl?: string;
    },
  ) {
    this.io.to(`user:${userId}`).emit("notification", {
      ...notification,
      id: this.generateId(),
      createdAt: new Date(),
    });
  }

  /**
   * Emit review reminder to user
   */
  public emitReviewReminder(userId: string, problemsDue: number) {
    this.io.to(`user:${userId}`).emit("review-reminder", {
      problemsDue,
      message: `You have ${problemsDue} problem(s) due for review!`,
    });
  }

  /**
   * Broadcast system message to a room
   */
  public broadcastToRoom(roomId: string, event: string, data: any) {
    this.io.to(`room:${roomId}`).emit(event, data);
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private getOnlineUsersList(): UserSocket[] {
    return Array.from(this.onlineUsers.values());
  }

  private getUserByClerkId(clerkId: string): UserSocket | undefined {
    for (const user of this.onlineUsers.values()) {
      if (user.clerkId === clerkId) return user;
    }
    return undefined;
  }

  private getRoomMembers(roomId: string): UserSocket[] {
    const room = this.io.sockets.adapter.rooms.get(`room:${roomId}`);
    if (!room) return [];

    const members: UserSocket[] = [];
    room.forEach((socketId) => {
      const user = this.onlineUsers.get(socketId);
      if (user) members.push(user);
    });
    return members;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get the Socket.io server instance
   */
  public getIO(): Server {
    return this.io;
  }
}

// ============================================================================
// Export singleton creator
// ============================================================================

let socketServer: SocketServer | null = null;

export function initSocketServer(httpServer: HTTPServer): SocketServer {
  if (!socketServer) {
    socketServer = new SocketServer(httpServer);
  }
  return socketServer;
}

export function getSocketServer(): SocketServer | null {
  return socketServer;
}
