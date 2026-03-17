import Link from "next/link";
import { Button } from "@/components/ui/button";

const resourceCards = [
  {
    title: "Prompt Library",
    description: "High-signal prompts for compliance, research, and product reviews.",
    tag: "Templates",
  },
  {
    title: "Guided Onboarding",
    description: "Step-by-step playbooks to get your team up to speed quickly.",
    tag: "Guides",
  },
  {
    title: "PDF Hygiene",
    description: "Best practices for preparing documents and extracting clean data.",
    tag: "Insights",
  },
  {
    title: "Graph Playbook",
    description: "Learn how to read, edit, and present relationship maps.",
    tag: "Tutorial",
  },
  {
    title: "Security Overview",
    description: "How we protect your data and keep your workspace compliant.",
    tag: "Security",
  },
  {
    title: "Research Ops",
    description: "Run faster synthesis cycles across teams and stakeholders.",
    tag: "Ops",
  },
];

export default function ResourcesPage() {
  return (
    <main className="noise-bg">
      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Resources</div>
            <h1 className="text-4xl font-semibold">Everything your team needs to learn faster.</h1>
            <p className="text-base text-muted-foreground">
              Grab templates, read playbooks, and keep your team aligned on best practices for PDF intelligence.
            </p>
          </div>
          <div className="rounded-[28px] border border-foreground/10 bg-white/80 p-6">
            <div className="text-sm font-semibold">Resource highlights</div>
            <p className="mt-3 text-sm text-muted-foreground">
              New playbooks drop every week. Use them to move from document review to strategy faster.
            </p>
            <Button className="mt-5 rounded-full" asChild>
              <Link href="/dashboard">Open workspace</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {resourceCards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-foreground/10 bg-white/80 p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{card.tag}</div>
              <div className="mt-2 text-base font-semibold">{card.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
              <Button variant="outline" className="mt-4 rounded-full" asChild>
                <Link href="/signup">Open</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
