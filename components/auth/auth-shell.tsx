import { AuthNav } from "@/components/nav/auth-nav";
import { Card, CardContent } from "@/components/ui/card";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="page-gradient min-h-screen pb-24 md:pb-10">
      <div className="relative mx-auto max-w-md px-4 py-8">
        <AuthNav />
        <Card className="shadow-card">
          <div className="border-b border-teal-50 bg-gradient-to-l from-muted/70 to-white px-6 py-5 sm:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-primary-dark">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm leading-relaxed text-teal-700">
                {subtitle}
              </p>
            )}
          </div>
          <CardContent className="px-6 py-6 sm:px-8">{children}</CardContent>
          {footer && (
            <div className="border-t border-teal-50 bg-muted/25 px-6 py-4 sm:px-8">
              {footer}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
