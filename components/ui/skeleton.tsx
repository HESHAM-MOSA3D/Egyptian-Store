import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-teal-100/80", className)}
      aria-hidden
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="surface-card flex flex-col overflow-hidden">
      <Skeleton className="aspect-[4/3] rounded-none sm:aspect-square" />
      <div className="flex flex-1 flex-col gap-2.5 p-3">
        <Skeleton className="h-3 w-16 rounded-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="mt-1 h-5 w-24" />
        <Skeleton className="mt-2 h-9 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function ChipRowSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-24 shrink-0 rounded-full" />
      ))}
    </div>
  );
}
