 "use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources" },
  { label: "Company", href: "/about" },
];

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");
    // Default to light; only enable dark when user explicitly saved it.
    const shouldUseDark = stored ? stored === "dark" : false;
    root.classList.toggle("dark", shouldUseDark);
    setIsDark(shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = !isDark;
    root.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  };

  return (
    <div className="fixed top-0 z-[9999] px-3 pt-3 w-full">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-[28px] border border-white/40 bg-white/20 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/30 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative inline-flex size-10 items-center justify-center rounded-2xl bg-linear-to-br from-teal-600 via-emerald-500 to-amber-400 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(16,185,129,0.35)]">
            RM          </span>
          <div className="leading-tight">
            <div className="text-base font-semibold uppercase tracking-[0.24em] text-slate-900 dark:text-white">Rimiacey</div>
            <div className="text-[11px] uppercase tracking-[0.28em] text-slate-600 dark:text-slate-300">PDF intelligence studio</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-600 dark:text-slate-200 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-slate-900 dark:hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden rounded-full border-white/40 bg-white/30 text-slate-800 shadow-sm backdrop-blur md:inline-flex dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
            onClick={toggleTheme}
          >
            {isDark ? "Light mode" : "Dark mode"}
          </Button>
          {status !== "loading" && !session?.user && (
            <Button variant="ghost" className="hidden md:inline-flex text-slate-700 dark:text-slate-200" asChild>
              <Link href="/signup">Sign in</Link>
            </Button>
          )}
          {session?.user && (
            <Button variant="ghost" className="hidden md:inline-flex text-slate-700 dark:text-slate-200" asChild>
              <Link href="/dashboard">{session.user.name || session.user.email || "Account"}</Link>
            </Button>
          )}
          <Button className="rounded-full bg-slate-900 text-white shadow-[0_12px_24px_rgba(15,23,42,0.25)] hover:bg-slate-900/90 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90" asChild>
            <Link href="/dashboard">Open dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
