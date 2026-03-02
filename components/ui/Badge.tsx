interface BadgeProps {
  children: React.ReactNode;
  color?: "honey" | "green" | "red" | "bear" | "peach";
}

const COLORS = {
  honey: "bg-honey-50 text-honey-600 border-honey-400/40",
  green: "bg-green-50 text-green-700 border-green-200",
  red: "bg-red-50 text-red-600 border-red-200",
  bear: "bg-bear-50 text-bear-400 border-bear-100",
  peach: "bg-peach-100 text-peach-400 border-peach-200",
};

export default function Badge({ children, color = "bear" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border ${COLORS[color]}`}
    >
      {children}
    </span>
  );
}
