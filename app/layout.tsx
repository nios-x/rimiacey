import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
//@ts-ignore
import "./globals.css";
import AuthProvider from "./providers/auth-provider";
import Navbar from "../components/navbar";
import { TooltipProvider } from "@/components/ui/tooltip"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});


export const metadata: Metadata = {
  title: "Rimiacey AI - Learn & Visualise PDF Docs",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}>
        <AuthProvider>
          <Navbar />
          <TooltipProvider>{children}</TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
