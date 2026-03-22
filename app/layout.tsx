import type { Metadata } from "next";
import { Inter, Noto_Serif_Sinhala } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { LayoutDashboard, PlusCircle, TableProperties } from "lucide-react";
import { cookies } from "next/headers";
import { LogoutButton } from "@/components/LogoutButton";

import Navbar from "@/components/Navbar";
import { LanguageProvider } from "@/context/LanguageContext";

// Use Inter font for a modern tech feel
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSerifSinhala = Noto_Serif_Sinhala({ 
  subsets: ["sinhala"], 
  weight: ["400", "700"],
  variable: "--font-noto-sinhala" 
});

export const metadata: Metadata = {
  title: "PCC Dibo - Data Hub",
  description: "Premium student data management system",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${notoSerifSinhala.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased text-slate-900 bg-slate-50/50 min-h-screen">
        <LanguageProvider>
          <Navbar />

          {/* Dynamic Background Pattern */}
          <div className="fixed inset-0 z-[-1] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
          <div className="fixed top-[-10%] right-[-5%] z-[-2] w-[500px] h-[500px] rounded-full bg-brand-400/20 blur-[100px] pointer-events-none"></div>
          <div className="fixed bottom-[-10%] left-[-5%] z-[-2] w-[400px] h-[400px] rounded-full bg-blue-400/20 blur-[120px] pointer-events-none"></div>

          {/* Main Workspace */}
          <main className="flex-1 pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
