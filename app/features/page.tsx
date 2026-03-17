import Link from "next/link";
import { Button } from "@/components/ui/button";

const featureSections = [
  {
    title: "Conversation layer",
    description: "Ask complex questions with citations and follow-ups.",
  },
  {
    title: "Relationship graphs",
    description: "See how ideas connect and discover hidden dependencies.",
  },
  {
    title: "Prompt kits",
    description: "Kickstart analysis with expert prompt templates.",
  },
  {
    title: "Secure storage",
    description: "Keep documents private with workspace controls.",
  },
  {
    title: "Team sharing",
    description: "Invite teammates and collaborate on the same collections.",
  },
  {
    title: "Exportable insights",
    description: "Turn chat responses into shareable briefs and summaries.",
  },
];

const capabilityList = [
  "Semantic search across every PDF",
  "Side-by-side summaries and timelines",
  "Evidence-backed answers with citations",
  "Concept clustering and visual mapping",
  "Session history with replayable threads",
  "Workspace roles and permissions",
];

export default function FeaturesPage() {
  return (
    <main className="noise-bg">
      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Features</div>
            <h1 className="text-4xl font-semibold">Every feature you need to turn PDFs into decisions.</h1>
            <p className="text-base text-muted-foreground">
              Rimiacey combines chat, summarization, and graph visualizations in one place so your team can
              move faster from reading to action.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90" asChild>
                <Link href="/dashboard">Try the workspace</Link>
              </Button>
              <Button variant="outline" className="rounded-full" asChild>
                <Link href="/pricing">View pricing</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-[28px] border border-foreground/10 bg-white/80 p-6">
            <div className="text-sm font-semibold">Capabilities</div>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {capabilityList.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="inline-flex size-2 rounded-full bg-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {featureSections.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-foreground/10 bg-white/80 p-5">
              <div className="text-base font-semibold">{feature.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20 md:px-6">
        <div className="rounded-[28px] border border-foreground/10 bg-white/70 p-8">
          <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Workflow</div>
              <h2 className="mt-2 text-3xl font-semibold">From upload to insight, end-to-end.</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Upload PDFs, build a knowledge base, ask questions, and share results. Everything stays connected
                in your workspace.
              </p>
            </div>
            <div className="rounded-2xl border border-foreground/10 bg-white p-5">
              <div className="text-sm font-semibold">Included in every workspace</div>
              <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
                <div>1. Upload PDFs and auto-index</div>
                <div>2. Ask questions with context</div>
                <div>3. Generate visual relationship maps</div>
                <div>4. Export summaries and briefs</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
