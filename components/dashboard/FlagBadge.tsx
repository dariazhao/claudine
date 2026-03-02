interface FlagBadgeProps {
  count: number;
  reviewed?: boolean;
}

export default function FlagBadge({ count, reviewed }: FlagBadgeProps) {
  if (count === 0) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
        reviewed
          ? "bg-bear-50 text-bear-200 border border-bear-100"
          : "bg-red-50 text-red-600 border border-red-200"
      }`}
    >
      🚩 {count}
    </span>
  );
}
