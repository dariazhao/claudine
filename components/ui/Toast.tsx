"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onDismiss?: () => void;
}

const TYPE_STYLES = {
  success: "bg-green-50 border-green-200 text-green-700",
  error: "bg-red-50 border-red-200 text-red-600",
  info: "bg-honey-50 border-honey-400/30 text-honey-600",
};

const TYPE_EMOJI = {
  success: "✅",
  error: "⚠️",
  info: "🍯",
};

export default function Toast({
  message,
  type = "info",
  duration = 3000,
  onDismiss,
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, duration);
    return () => clearTimeout(t);
  }, [duration, onDismiss]);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-5 py-3 rounded-2xl border shadow-md text-sm font-semibold z-50 ${TYPE_STYLES[type]}`}
    >
      <span>{TYPE_EMOJI[type]}</span>
      <span>{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          onDismiss?.();
        }}
        className="ml-2 opacity-60 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}
