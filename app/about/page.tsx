import Link from "next/link";
import { Button } from "@/components/ui/button";

const values = [
  {
    title: "Clarity",
    description: "We turn complex documents into actionable insights anyone can understand.",
  },
  {
    title: "Velocity",
    description: "Teams move faster when knowledge is shared and searchable.",
  },
  {
    title: "Trust",
    description: "Security, citations, and transparency are built into every response.",
  },
];

export default function AboutPage() {
  return (
    <main className="noise-bg">
      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Company</div>
            <h1 className="text-4xl font-semibold">We help teams turn documents into decisions.</h1>
            <p className="text-base text-muted-foreground">
              Rimiacey is built for researchers, policy teams, and product orgs who live in PDFs. We focus on
              clarity, visual insight, and collaboration so your team can act with confidence.
            </p>
          </div>
          <div className="rounded-[28px] border border-foreground/10 bg-white/80 p-6">
            <div className="text-sm font-semibold">Get in touch</div>
            <p className="mt-3 text-sm text-muted-foreground">
              Want a private deployment or custom onboarding? We would love to help.
            </p>
            <Button className="mt-5 rounded-full" asChild>
              <Link href="/signup">Contact sales</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="rounded-2xl border border-foreground/10 bg-white/80 p-5">
              <div className="text-base font-semibold">{value.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
