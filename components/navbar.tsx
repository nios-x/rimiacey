 "use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources" },
  { label: "Company", href: "/about" },
];

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    const shouldUseDark = stored ? stored === "dark" : prefersDark;
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
    <div className="sticky top-0 z-[9999] border-b border-white/50 bg-white/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative inline-flex size-10 items-center justify-center rounded-2xl bg-linear-to-br from-teal-600 via-emerald-500 to-amber-400 text-sm font-semibold text-white">
            Rm
          </span>
          <div className="leading-tight">
            <div className="text-base font-semibold">Rimiacey</div>
            <div className="text-xs text-muted-foreground">PDF intelligence studio</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden rounded-full md:inline-flex" onClick={toggleTheme}>
            {isDark ? "Light mode" : "Dark mode"}
          </Button>
          <Button variant="ghost" className="hidden md:inline-flex" asChild>
            <Link href="/signup">Sign in</Link>
          </Button>
          <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90" asChild>
            <Link href="/dashboard">Open dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
