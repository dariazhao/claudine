interface BearGreetingProps {
  name: string;
}

function getGreeting(name: string): { text: string; mood: "happy" | "sleepy" | "celebrating" } {
  const hour = new Date().getHours();
  if (hour < 6)
    return { text: `You're up early, ${name}! 🌙`, mood: "sleepy" };
  if (hour < 12)
    return { text: `Good morning, ${name}! ☀️`, mood: "happy" };
  if (hour < 17)
    return { text: `Good afternoon, ${name}! 🌤️`, mood: "happy" };
  if (hour < 21)
    return { text: `Good evening, ${name}! 🌅`, mood: "happy" };
  return { text: `Getting cozy, ${name}? 🌙`, mood: "sleepy" };
}

export default function BearGreeting({ name }: BearGreetingProps) {
  const { text } = getGreeting(name);
  return (
    <p className="text-xl font-bold text-bear-600">{text}</p>
  );
}
