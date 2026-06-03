import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  action,
  backHref,
  backLabel = "رجوع",
  sticky = false,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  sticky?: boolean;
  className?: string;
}) {
  if (backHref) {
    return (
      <header
        className={cn(
          "border-b border-teal-100/90 bg-white/95 backdrop-blur-md shadow-soft",
          sticky && "sticky top-0 z-40",
          className
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3">
          <Link
            href={backHref}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-teal-800 transition hover:bg-muted"
            aria-label={backLabel}
          >
            <ArrowRight className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="line-clamp-1 text-lg font-bold text-primary-dark">
              {title}
            </h1>
            {description && (
              <p className="line-clamp-1 text-xs text-teal-600">{description}</p>
            )}
          </div>
          {action}
        </div>
      </header>
    );
  }

  return (
    <div
      className={cn(
        "mb-6 flex flex-wrap items-start justify-between gap-4",
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-primary-dark md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-teal-700">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
