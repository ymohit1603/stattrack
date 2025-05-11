// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthGuard from "@/components/AuthGuard";
import MainLayout from "@/layouts/MainLayout";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'StatTrack',
  description: 'Track your coding activity and improve your productivity',
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
        <Toaster /> 
      </body> 
    </html>
  );
}

