"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onHide: () => void;
  type?: "success" | "warning";
}

export default function Toast({ message, isVisible, onHide, type = "success" }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onHide, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  return (
    <div className={`fixed bottom-6 right-6 z-[3000] bg-charcoal text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"}`}>
      <span className="text-xl">{type === "warning" ? "⚠️" : "✅"}</span>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
