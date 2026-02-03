"use client";

interface ChartsProps {
  difficultyData: Record<string, number>;
  topicData: Record<string, number>;
}

export default function DashboardCharts({
  difficultyData,
  topicData,
}: ChartsProps) {
  const difficultyColors: Record<string, string> = {
    EASY: "bg-green-500",
    MEDIUM: "bg-yellow-500",
    HARD: "bg-red-500",
  };

  const total = Object.values(difficultyData).reduce((a, b) => a + b, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Difficulty Breakdown
        </h3>
        <div className="space-y-3">
          {Object.entries(difficultyData).map(([difficulty, count]) => {
            const percentage =
              total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={difficulty}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">{difficulty}</span>
                  <span className="text-slate-400">
                    {count} ({percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${difficultyColors[difficulty as keyof typeof difficultyColors]}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Top Topics</h3>
        <div className="space-y-2">
          {Object.entries(topicData)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([topic, count]) => (
              <div
                key={topic}
                className="flex justify-between items-center py-2 border-b border-white/5"
              >
                <span className="text-slate-300">{topic}</span>
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium">
                  {count}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
