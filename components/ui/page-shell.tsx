import { cn } from "@/lib/utils";

const maxWidths = {
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "6xl": "max-w-6xl",
} as const;

export function PageShell({
  children,
  className,
  maxWidth = "6xl",
  padded = true,
  gradient = false,
}: {
  children: React.ReactNode;
  className?: string;
  maxWidth?: keyof typeof maxWidths;
  padded?: boolean;
  gradient?: boolean;
}) {
  return (
    <div
      className={cn(
        "min-h-screen",
        gradient && "page-gradient",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto w-full",
          maxWidths[maxWidth],
          padded && "px-4 sm:px-6"
        )}
      >
        {children}
      </div>
    </div>
  );
}
