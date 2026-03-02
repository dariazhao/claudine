"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Dot,
} from "recharts";

export interface TrendPoint {
  date: string;
  score: number;
}

function scoreToColor(score: number): string {
  if (score >= 0.7)   return "#f59e0b";
  if (score >= 0.3)   return "#22c55e";
  if (score >= -0.29) return "#c8956c";
  if (score >= -0.69) return "#f4956b";
  return "#ef4444";
}

interface Props {
  data: TrendPoint[];
  compact?: boolean;
}

export default function MoodTrendChart({ data, compact = false }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-bear-200 text-xs font-semibold">
        No mood data yet
      </div>
    );
  }

  const lastScore = data[data.length - 1]?.score ?? 0;
  const lineColor = scoreToColor(lastScore);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={
          compact
            ? { top: 4, right: 4, bottom: 4, left: 4 }
            : { top: 8, right: 8, bottom: 0, left: -10 }
        }
      >
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={lineColor} stopOpacity={0.35} />
            <stop offset="95%" stopColor={lineColor} stopOpacity={0.03} />
          </linearGradient>
        </defs>

        {!compact && (
          <CartesianGrid strokeDasharray="3 3" stroke="#faebd7" vertical={false} />
        )}

        {!compact && (
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#c8956c", fontWeight: 600 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
        )}

        {!compact && (
          <YAxis
            domain={[-1, 1]}
            tick={{ fontSize: 11, fill: "#c8956c", fontWeight: 600 }}
            tickLine={false}
            axisLine={false}
            tickCount={5}
            tickFormatter={(v) => v.toFixed(1)}
          />
        )}

        <ReferenceLine
          y={0}
          stroke="#ddb393"
          strokeDasharray="4 4"
          strokeWidth={compact ? 1 : 1.5}
        />

        {!compact && (
          <Tooltip
            formatter={(val: unknown) => {
              const n = val as number;
              return [`${n >= 0 ? "+" : ""}${n.toFixed(2)}`, "Mood score"];
            }}
            labelFormatter={(label) => String(label)}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #faebd7",
              fontSize: 12,
              boxShadow: "0 4px 12px rgba(139,94,60,0.10)",
            }}
            labelStyle={{ color: "#8b5e3c", fontWeight: 700, fontSize: 12 }}
          />
        )}

        <Area
          type="monotone"
          dataKey="score"
          stroke={lineColor}
          strokeWidth={compact ? 2 : 2.5}
          fill="url(#trendGradient)"
          dot={compact ? false : <Dot r={3} fill={lineColor} strokeWidth={0} />}
          activeDot={
            compact
              ? { r: 0 }
              : <Dot r={5} fill={lineColor} stroke="white" strokeWidth={2} />
          }
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
