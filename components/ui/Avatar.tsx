interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-xl",
};

export default function Avatar({ name, src, size = "md" }: AvatarProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover ${SIZES[size]}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-bear-100 flex items-center justify-center text-bear-600 font-bold flex-shrink-0 ${SIZES[size]}`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
