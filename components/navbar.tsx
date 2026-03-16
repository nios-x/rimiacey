import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-white/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-sm font-semibold text-white">
            Rm
          </span>
          <div className="leading-tight">
            <div className="text-base font-semibold">Rimiacey</div>
            <div className="text-xs text-muted-foreground">PDF intelligence studio</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="/#features" className="transition hover:text-foreground">
            Features
          </Link>
          <Link href="/#flow" className="transition hover:text-foreground">
            Workflow
          </Link>
          <Link href="/#examples" className="transition hover:text-foreground">
            Examples
          </Link>
          <Link href="/#cta" className="transition hover:text-foreground">
            Get started
          </Link>
        </nav>

        <div className="flex items-center gap-2">
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
