import { cn } from "@/lib/utils";

export function DataTable({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-soft",
        className
      )}
    >
      <div className="hidden overflow-x-auto md:block">{children}</div>
    </div>
  );
}

export function DataTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-teal-50 bg-teal-50/60 text-right text-sm text-teal-800">
        {children}
      </tr>
    </thead>
  );
}

export function DataTableTh({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={cn("px-4 py-3 font-semibold", className)}>{children}</th>
  );
}

export function DataTableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function DataTableRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tr
      className={cn(
        "border-b border-teal-50/80 last:border-0 transition hover:bg-teal-50/25",
        className
      )}
    >
      {children}
    </tr>
  );
}

export function DataTableTd({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={cn("px-4 py-3 text-sm", className)}>{children}</td>;
}
