export default function HoneyLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <div className="text-4xl animate-bounce">🍯</div>
      <p className="text-bear-400 font-semibold text-sm">{label}</p>
    </div>
  );
}
