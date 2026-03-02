"use client";

import {
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Dot,
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
  if (score >= 0.7)  return "#f59e0b"; // JOYFUL
  if (score >= 0.3)  return "#22c55e"; // POSITIVE
  if (score >= -0.29) return "#c8956c"; // NEUTRAL
  if (score >= -0.69) return "#f4956b"; // CONCERNED
  return "#ef4444";                     // DISTRESSED
}

function scoreToGradientId(score: number): string {
  if (score >= 0.7)  return "grad-joyful";
  if (score >= 0.3)  return "grad-positive";
  if (score >= -0.29) return "grad-neutral";
  if (score >= -0.69) return "grad-concerned";
  return "grad-distressed";
}

const GRADIENTS = [
  { id: "grad-joyful",     color: "#f59e0b" },
  { id: "grad-positive",   color: "#22c55e" },
  { id: "grad-neutral",    color: "#c8956c" },
  { id: "grad-concerned",  color: "#f4956b" },
  { id: "grad-distressed", color: "#ef4444" },
];

export default function SentimentSparkline({ data, height = 56 }: SentimentSparklineProps) {
  const chartData = [...data]
    .reverse()
    .map((d, i) => ({ day: i, score: d.sentimentScore ?? null }))
    .filter((d) => d.score !== null);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center text-bear-200 text-xs" style={{ height }}>
        No data yet
      </div>
    );
  }

  const lastScore = chartData[chartData.length - 1]?.score ?? 0;
  const lineColor = scoreToColor(lastScore);
  const gradId = scoreToGradientId(lastScore);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 6, right: 4, bottom: 4, left: 4 }}>
        <defs>
          {GRADIENTS.map((g) => (
            <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={g.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={g.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>

        <ReferenceLine y={0} stroke="#f5d5b0" strokeDasharray="3 3" />

        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const val = payload[0].value as number;
            return (
              <div className="bg-white border border-bear-100 rounded-xl px-2.5 py-1.5 text-xs font-bold shadow-sm" style={{ color: scoreToColor(val) }}>
                {val >= 0 ? "+" : ""}{val.toFixed(2)}
              </div>
            );
          }}
        />

        <Area
          type="monotone"
          dataKey="score"
          stroke={lineColor}
          strokeWidth={2.5}
          fill={`url(#${gradId})`}
          dot={false}
          activeDot={<Dot r={5} fill={lineColor} stroke="white" strokeWidth={2} />}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
