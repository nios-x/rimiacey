import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
//@ts-ignore
import "./globals.css";
import AuthProvider from "./providers/auth-provider";
import Navbar from "../components/navbar";
import { TooltipProvider } from "@/components/ui/tooltip"


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
      <body className={`antialiased`}>
        <AuthProvider>
          <Navbar />
          <TooltipProvider>{children}</TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
