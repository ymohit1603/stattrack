// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthGuard from "@/components/AuthGuard";
import MainLayout from "@/layouts/MainLayout";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StatTrack - Your Coding Analytics Dashboard",
  description: "Track your coding activity, analyze your productivity, and improve your development workflow with StatTrack.",
  keywords: ["coding analytics", "productivity", "development", "time tracking", "programming"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
        <AuthGuard>
          <MainLayout>
            {children}
          </MainLayout>
        </AuthGuard>
      </body>
    </html>
  );
}
