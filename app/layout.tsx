import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { AuthProvider } from "@/contexts/auth-context";

export const metadata: Metadata = {
  title: "MwanAfrika - Learning Feeds the Future",
  description:
    "Gamified educational app for underprivileged students aligned with school curriculum",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <WhatsAppButton />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
