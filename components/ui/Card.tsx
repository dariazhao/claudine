interface CardProps {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}

export default function Card({
  children,
  className = "",
  padded = true,
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-bear-100 shadow-sm ${
        padded ? "p-5" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
