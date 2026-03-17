import Link from "next/link";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "$0",
    description: "For quick experiments and personal research.",
    features: [
      "3 PDF collections",
      "Basic chat and summaries",
      "Standard response speed",
    ],
    cta: "Get started",
  },
  {
    name: "Team",
    price: "$29",
    description: "For teams shipping insights weekly.",
    features: [
      "Unlimited collections",
      "Relationship graphs",
      "Shared workspaces",
      "Priority responses",
    ],
    cta: "Start team plan",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For org-wide knowledge and compliance needs.",
    features: [
      "Private deployment options",
      "Advanced access controls",
      "Dedicated support",
    ],
    cta: "Contact sales",
  },
];

export default function PricingPage() {
  return (
    <main className="noise-bg">
      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
        <div className="space-y-4 text-center">
          <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Pricing</div>
          <h1 className="text-4xl font-semibold">Plans for every research pace.</h1>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            Start free, then upgrade when your team is ready to scale knowledge across collections.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl border border-foreground/10 p-6 ${
                plan.highlighted
                  ? "gradient-border border-transparent bg-white/90"
                  : "bg-white/80"
              }`}
            >
              <div className="text-sm text-muted-foreground">{plan.name}</div>
              <div className="mt-3 text-3xl font-semibold">{plan.price}</div>
              <div className="mt-2 text-sm text-muted-foreground">{plan.description}</div>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="inline-flex size-2 rounded-full bg-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className={`mt-6 w-full rounded-full ${
                  plan.highlighted ? "bg-foreground text-background" : ""
                }`}
                variant={plan.highlighted ? "default" : "outline"}
                asChild
              >
                <Link href={plan.name === "Enterprise" ? "/about" : "/signup"}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-foreground/10 bg-white/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-4 py-14 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Questions</div>
            <h2 className="mt-2 text-3xl font-semibold">Need a custom workspace?</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90" asChild>
              <Link href="/about">Talk to sales</Link>
            </Button>
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/features">Compare features</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
