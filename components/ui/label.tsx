import { cn } from "@/lib/utils";

export function Label({
  className,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "mb-1 block text-sm font-semibold text-primary-dark",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}
