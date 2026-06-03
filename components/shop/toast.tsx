"use client";

import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toast({
  message,
  visible,
  onClose,
  durationMs = 2800,
}: {
  message: string;
  visible: boolean;
  onClose: () => void;
  durationMs?: number;
}) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onClose, durationMs);
    return () => clearTimeout(t);
  }, [visible, durationMs, onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-none fixed left-4 right-4 top-[4.5rem] z-[60] mx-auto flex max-w-md sm:top-20",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="pointer-events-auto flex w-full items-center gap-3 rounded-2xl border border-teal-100 bg-white px-4 py-3 shadow-card">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" aria-hidden />
        <p className="flex-1 text-sm font-semibold leading-snug text-primary-dark">
          {message}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-teal-600 hover:bg-muted"
          aria-label="إغلاق"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
