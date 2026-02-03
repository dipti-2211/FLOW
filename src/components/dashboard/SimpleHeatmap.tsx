"use client";

interface ActivityData {
  date: string;
  count: number;
}

export default function ActivityHeatmap({ data }: { data: ActivityData[] }) {
  const getColor = (count: number) => {
    if (count === 0) return "bg-slate-800";
    if (count <= 2) return "bg-emerald-900/70";
    if (count <= 4) return "bg-emerald-700";
    if (count <= 6) return "bg-emerald-500";
    return "bg-emerald-400";
  };

  const days = Array.from({ length: 365 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (364 - i));
    return date.toISOString().split("T")[0];
  });

  const dataMap = new Map(data.map((d) => [d.date, d.count]));

  return (
    <div className="flex flex-wrap gap-1">
      {days.map((day) => {
        const count = dataMap.get(day) || 0;
        return (
          <div
            key={day}
            className={`w-3 h-3 rounded-sm ${getColor(count)}`}
            title={`${day}: ${count} problems`}
          />
        );
      })}
    </div>
  );
}
