"use client";

import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface DataPoint {
  sentimentScore: number | null;
  createdAt: string | Date;
}

interface SentimentSparklineProps {
  data: DataPoint[];
  height?: number;
}

function scoreToColor(score: number): string {
  if (score >= 0.7) return "#f59e0b"; // JOYFUL - honey
  if (score >= 0.3) return "#22c55e"; // POSITIVE - green
  if (score >= -0.29) return "#c8956c"; // NEUTRAL - bear
  if (score >= -0.69) return "#f4956b"; // CONCERNED - peach
  return "#ef4444"; // DISTRESSED - red
}

export default function SentimentSparkline({
  data,
  height = 48,
}: SentimentSparklineProps) {
  const chartData = [...data]
    .reverse()
    .map((d, i) => ({
      day: i,
      score: d.sentimentScore ?? null,
    }))
    .filter((d) => d.score !== null);

  if (chartData.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-bear-200 text-xs"
        style={{ height }}
      >
        No data yet
      </div>
    );
  }

  const lastScore = chartData[chartData.length - 1]?.score ?? 0;
  const lineColor = scoreToColor(lastScore);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <ReferenceLine y={0} stroke="#f5d5b0" strokeDasharray="3 3" />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const val = payload[0].value as number;
            return (
              <div className="bg-white border border-bear-100 rounded-lg px-2 py-1 text-xs text-bear-600 shadow">
                {val.toFixed(2)}
              </div>
            );
          }}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke={lineColor}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: lineColor }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
