"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export interface DistPoint {
  name: string;
  value: number;
  color: string;
}

interface Props {
  data: DistPoint[];
  compact?: boolean;
  total?: number;
}

export default function MoodDistributionChart({
  data,
  compact = false,
  total = 0,
}: Props) {
  const filtered = data.filter((d) => d.value > 0);

  if (filtered.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-bear-200 text-xs font-semibold">
        No data yet
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filtered}
            cx="50%"
            cy="50%"
            innerRadius={compact ? 26 : 62}
            outerRadius={compact ? 44 : 100}
            paddingAngle={3}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {filtered.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>

          {!compact && (
            <Tooltip
              formatter={(val: unknown) => {
                const n = val as number;
                return [`${n} check-in${n !== 1 ? "s" : ""} · ${Math.round((n / total) * 100)}%`, ""];
              }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #faebd7",
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(139,94,60,0.10)",
              }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>

      {/* Center total count — full mode only */}
      {!compact && total > 0 && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <p className="text-3xl font-extrabold text-bear-600 leading-none">{total}</p>
          <p className="text-xs text-bear-300 font-semibold mt-1">check-ins</p>
        </div>
      )}
    </div>
  );
}
