import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { CartDrawerProvider } from "@/components/shop/cart-drawer-provider";
import { MobileBottomNav } from "@/components/shop/mobile-bottom-nav";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "كتالوج الجملة — عناية وتجميل B2B",
  description: "كتالوج جملة عربي — طلبات عبر واتساب، أسعار بالجنيه المصري",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body
        className="min-h-screen antialiased"
        suppressHydrationWarning
      >
        <CartDrawerProvider>
          {children}
          <MobileBottomNav />
        </CartDrawerProvider>
      </body>
    </html>
  );
}
