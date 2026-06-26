import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CSP Beauty — Hyper-Local Wholesale",
  description: "11,098 premium beauty products. Real-time stock. 25% wholesale margin. B2B e-commerce platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}