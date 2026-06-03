import Link from "next/link";
import { Sparkles } from "lucide-react";

export function AuthNav() {
  return (
    <Link
      href="/"
      className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/90 px-3.5 py-2 text-sm font-semibold text-primary shadow-soft backdrop-blur transition hover:bg-teal-50/50"
    >
      <Sparkles className="h-4 w-4" aria-hidden />
      العودة للرئيسية
    </Link>
  );
}
