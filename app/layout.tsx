import type { Metadata } from "next";
import localFont from "next/font/local";
//@ts-ignore
import "./globals.css";
import AuthProvider from "./providers/auth-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = localFont({
  src: [
    { path: "../public/fonts/Geist-Light.ttf", weight: "300", style: "normal" },
    { path: "../public/fonts/Geist-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/Geist-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/Geist-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/Geist-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: [
    { path: "../public/fonts/Geist-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/Geist-Medium.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-geist-mono",
  display: "swap",
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
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
