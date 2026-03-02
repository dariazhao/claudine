"use client";

export type CalData = Record<string, string | null>;

const SENTIMENT_COLORS: Record<string, string> = {
  JOYFUL:     "#fbbf24",
  POSITIVE:   "#4ade80",
  NEUTRAL:    "#ddb393",
  CONCERNED:  "#f4956b",
  DISTRESSED: "#f87171",
};

const SENTIMENT_NAMES: Record<string, string> = {
  JOYFUL:     "Joyful",
  POSITIVE:   "Positive",
  NEUTRAL:    "Neutral",
  CONCERNED:  "Concerned",
  DISTRESSED: "Distressed",
};

const SHORT_DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function toDateStr(d: Date): string {
  return d.toISOString().split("T")[0];
}

interface Props {
  data: CalData;
  compact?: boolean;
}

export default function StreakCalendar({ data, compact = false }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Start from the most recent Sunday, 12 weeks back
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay() - 84);

  // Build 13 weeks × 7 days grid
  const weeks: Date[][] = [];
  const cur = new Date(start);
  for (let w = 0; w < 13; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }

  const cell = compact ? 8 : 13;
  const gap  = compact ? 2 : 3;

  function cellBg(day: Date): string {
    if (day > today) return "transparent";
    const str = toDateStr(day);
    if (!(str in data)) return "#f0e6da";
    const label = data[str];
    return label && SENTIMENT_COLORS[label] ? SENTIMENT_COLORS[label] : "#c8956c";
  }

  function cellBorder(day: Date): string {
    if (day > today) return "transparent";
    const str = toDateStr(day);
    if (!(str in data)) return "#e8d5c4";
    const label = data[str];
    return label && SENTIMENT_COLORS[label] ? SENTIMENT_COLORS[label] : "#b07848";
  }

  function cellTitle(day: Date): string {
    if (day > today) return "";
    const str = toDateStr(day);
    const checked = str in data;
    const label = data[str];
    return `${str} · ${checked ? (label ? SENTIMENT_NAMES[label] ?? label : "Checked in") : "No check-in"}`;
  }

  // Month labels: show label at start of each calendar month
  const monthLabels = weeks.map((week) => {
    const sun = week[0];
    return sun.getDate() <= 7 ? MONTHS[sun.getMonth()] : null;
  });

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: compact ? 3 : 6 }}>

      {/* Month labels — full mode */}
      {!compact && (
        <div style={{ display: "flex", gap, paddingLeft: 22 }}>
          {weeks.map((_, wi) => (
            <div
              key={wi}
              style={{
                width: cell,
                fontSize: 9,
                color: "#c8956c",
                fontWeight: 600,
                textAlign: "center",
                flexShrink: 0,
              }}
            >
              {monthLabels[wi] ?? ""}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: compact ? 2 : 4, alignItems: "flex-start" }}>

        {/* Day labels — full mode */}
        {!compact && (
          <div style={{ display: "flex", flexDirection: "column", gap }}>
            {SHORT_DAYS.map((d, i) => (
              <div
                key={i}
                style={{
                  height: cell,
                  width: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  fontSize: 9,
                  color: "#c8956c",
                  fontWeight: 600,
                  paddingRight: 3,
                }}
              >
                {i % 2 !== 0 ? d : ""}
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        <div style={{ display: "flex", gap }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: "flex", flexDirection: "column", gap }}>
              {week.map((day, di) => (
                <div
                  key={di}
                  title={cellTitle(day)}
                  style={{
                    width: cell,
                    height: cell,
                    borderRadius: compact ? 2 : 3,
                    backgroundColor: cellBg(day),
                    border: `1px solid ${cellBorder(day)}`,
                    flexShrink: 0,
                    opacity: day > today ? 0 : 1,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend — full mode */}
      {!compact && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, paddingLeft: 22, marginTop: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div
              style={{
                width: 11, height: 11, borderRadius: 2,
                backgroundColor: "#f0e6da",
                border: "1px solid #e8d5c4",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 10, color: "#c8956c", fontWeight: 600 }}>No check-in</span>
          </div>
          {Object.entries(SENTIMENT_COLORS).map(([label, color]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div
                style={{
                  width: 11, height: 11, borderRadius: 2,
                  backgroundColor: color, flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 10, color: "#c8956c", fontWeight: 600 }}>
                {SENTIMENT_NAMES[label]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
