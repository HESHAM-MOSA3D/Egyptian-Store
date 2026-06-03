import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select">
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "flex h-11 w-full rounded-xl border border-teal-200/90 bg-white px-3 text-sm text-text",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0",
      "disabled:cursor-not-allowed disabled:opacity-50 min-h-11",
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
