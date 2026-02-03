// ============================================================================
// Dashboard Charts - Difficulty Donut & Topic Mastery Radar
// ============================================================================

"use client";

import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, Target, Award } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface DifficultyData {
  easy: number;
  medium: number;
  hard: number;
  totalEasy?: number;
  totalMedium?: number;
  totalHard?: number;
}

export interface TopicMasteryData {
  topic: string;
  score: number; // 0-100
  problemsSolved: number;
  totalProblems: number;
}

// ============================================================================
// Difficulty Donut Chart
// ============================================================================

const DIFFICULTY_COLORS = {
  easy: {
    main: "#10b981",
    light: "#34d399",
    gradient: "from-emerald-500 to-emerald-400",
  },
  medium: {
    main: "#f59e0b",
    light: "#fbbf24",
    gradient: "from-amber-500 to-amber-400",
  },
  hard: {
    main: "#ef4444",
    light: "#f87171",
    gradient: "from-red-500 to-red-400",
  },
};

interface DifficultyDonutProps {
  data: DifficultyData;
  className?: string;
}

export const DifficultyDonut: React.FC<DifficultyDonutProps> = ({
  data,
  className,
}) => {
  const chartData = useMemo(
    () => [
      {
        name: "Easy",
        value: data.easy,
        total: data.totalEasy || 0,
        color: DIFFICULTY_COLORS.easy.main,
        lightColor: DIFFICULTY_COLORS.easy.light,
      },
      {
        name: "Medium",
        value: data.medium,
        total: data.totalMedium || 0,
        color: DIFFICULTY_COLORS.medium.main,
        lightColor: DIFFICULTY_COLORS.medium.light,
      },
      {
        name: "Hard",
        value: data.hard,
        total: data.totalHard || 0,
        color: DIFFICULTY_COLORS.hard.main,
        lightColor: DIFFICULTY_COLORS.hard.light,
      },
    ],
    [data],
  );

  const totalSolved = data.easy + data.medium + data.hard;
  const totalProblems =
    (data.totalEasy || 0) + (data.totalMedium || 0) + (data.totalHard || 0);

  // Custom label component
  const renderCustomLabel = ({ cx, cy }: { cx: number; cy: number }) => (
    <g>
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        className="fill-white text-3xl font-bold"
      >
        {totalSolved}
      </text>
      <text
        x={cx}
        y={cy + 15}
        textAnchor="middle"
        className="fill-slate-400 text-sm"
      >
        Solved
      </text>
    </g>
  );

  return (
    <div
      className={cn(
        "relative p-6 rounded-2xl overflow-hidden",
        "bg-slate-800/30 backdrop-blur-xl border border-white/5",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            Difficulty Breakdown
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {totalProblems > 0
              ? `${((totalSolved / totalProblems) * 100).toFixed(1)}% completion`
              : "Start solving!"}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {chartData.map((entry, index) => (
                <linearGradient
                  key={`gradient-${index}`}
                  id={`gradient-${entry.name}`}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor={entry.color} />
                  <stop offset="100%" stopColor={entry.lightColor} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
              labelLine={false}
              label={renderCustomLabel}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#gradient-${entry.name})`}
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-lg px-3 py-2 shadow-xl">
                      <p className="text-white font-medium">{data.name}</p>
                      <p className="text-sm text-slate-400">
                        {data.value} / {data.total} solved
                      </p>
                      <p className="text-xs text-slate-500">
                        {data.total > 0
                          ? ((data.value / data.total) * 100).toFixed(1)
                          : 0}
                        % complete
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4">
        {chartData.map((item) => (
          <motion.div
            key={item.name}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <div>
              <span className="text-sm text-slate-300">{item.name}</span>
              <span className="text-xs text-slate-500 ml-2">
                {item.value}/{item.total}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// Topic Mastery Radar Chart
// ============================================================================

interface TopicMasteryRadarProps {
  data: TopicMasteryData[];
  className?: string;
}

export const TopicMasteryRadar: React.FC<TopicMasteryRadarProps> = ({
  data,
  className,
}) => {
  const avgMastery = useMemo(() => {
    if (data.length === 0) return 0;
    return Math.round(data.reduce((sum, d) => sum + d.score, 0) / data.length);
  }, [data]);

  const totalSolved = useMemo(() => {
    return data.reduce((sum, d) => sum + d.problemsSolved, 0);
  }, [data]);

  // Custom tick component for better styling
  const CustomTick = ({ payload, x, y, textAnchor }: any) => {
    const topicData = data.find((d) => d.topic === payload.value);

    return (
      <g transform={`translate(${x},${y})`}>
        <text textAnchor={textAnchor} className="fill-slate-400 text-xs" dy={4}>
          {payload.value}
        </text>
        {topicData && (
          <text
            textAnchor={textAnchor}
            className="fill-slate-600 text-[10px]"
            dy={18}
          >
            {topicData.problemsSolved}/{topicData.totalProblems}
          </text>
        )}
      </g>
    );
  };

  return (
    <div
      className={cn(
        "relative p-6 rounded-2xl overflow-hidden",
        "bg-slate-800/30 backdrop-blur-xl border border-white/5",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-violet-400" />
            Topic Mastery
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {avgMastery}% average mastery
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{totalSolved}</p>
          <p className="text-xs text-slate-500">Problems Solved</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <defs>
              <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="radarStroke" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <PolarGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="topic"
              tick={<CustomTick />}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "#64748b", fontSize: 10 }}
              tickCount={5}
              axisLine={false}
            />
            <Radar
              name="Mastery"
              dataKey="score"
              stroke="url(#radarStroke)"
              fill="url(#radarGradient)"
              fillOpacity={0.5}
              strokeWidth={2}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as TopicMasteryData;
                  return (
                    <div className="bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-lg px-3 py-2 shadow-xl">
                      <p className="text-white font-medium">{data.topic}</p>
                      <p className="text-sm text-cyan-400">
                        {data.score}% mastery
                      </p>
                      <p className="text-xs text-slate-400">
                        {data.problemsSolved} / {data.totalProblems} solved
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Topic Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {data.slice(0, 6).map((topic, index) => (
          <motion.div
            key={topic.topic}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-2 rounded-lg bg-white/5 border border-white/5"
          >
            <p className="text-xs text-slate-400 truncate">{topic.topic}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${topic.score}%` }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
                />
              </div>
              <span className="text-xs text-slate-300">{topic.score}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// Combined Dashboard Charts Component
// ============================================================================

interface DashboardChartsProps {
  difficultyData: DifficultyData;
  topicMasteryData: TopicMasteryData[];
  className?: string;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  difficultyData,
  topicMasteryData,
  className,
}) => {
  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6", className)}>
      <DifficultyDonut data={difficultyData} />
      <TopicMasteryRadar data={topicMasteryData} />
    </div>
  );
};

export default DashboardCharts;
