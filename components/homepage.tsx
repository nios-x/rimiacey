import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Instant document memory",
    description:
      "Upload a PDF once and ask follow-ups without losing context. Every answer stays grounded in your files.",
  },
  {
    title: "Human-sounding answers",
    description:
      "Switch between quick replies and detailed explanations. The tone stays helpful, crisp, and accurate.",
  },
  {
    title: "Relationship graphs",
    description:
      "See how concepts connect with a one-click graph so you can teach, study, or present with confidence.",
  },
];

const steps = [
  {
    title: "Drop the PDF",
    detail:
      "Upload reports, research, or manuals. We index, chunk, and store them securely.",
  },
  {
    title: "Ask in plain language",
    detail:
      "Questions, summaries, key themes, or explanations. It all works like a conversation.",
  },
  {
    title: "Explore connections",
    detail:
      "Generate an overview, then open the relationship map for deeper insight.",
  },
];

const examples = [
  "Summarize the compliance sections and list the deadlines.",
  "Find where the document mentions data retention policy.",
  "Explain the results section like I am onboarding a teammate.",
];

export default function Homepage() {
  return (
    <main className="bg-[radial-gradient(circle_at_top,#ffe9d2_0%,#ffffff_45%,#fff5ed_100%)]">
      <section className="relative overflow-hidden">
        <div className="absolute left-[-10%] top-[-20%] h-90 w-90 rounded-full bg-[radial-gradient(circle_at_center,#ff6b35_0%,rgba(255,107,53,0.0)_70%)] opacity-40 blur-3xl" />
        <div className="absolute right-[-15%] top-[10%] h-105 w-105 rounded-full bg-[radial-gradient(circle_at_center,#ffb86b_0%,rgba(255,184,107,0.0)_70%)] opacity-50 blur-3xl" />

        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:gap-12 md:px-6 md:py-24">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-white/70 px-4 py-1 text-xs text-muted-foreground shadow-sm">
              Built for research teams, founders, and students
            </div>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Turn any PDF into a living, visual knowledge base.
            </h1>
            <p className="text-base text-muted-foreground md:text-lg">
              Rimiacey helps you upload PDFs, chat in real time, and explore
              concept relationships with beautiful graphs. Learn faster, explain
              clearer, and never lose the thread.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90" asChild>
                <Link href="/dashboard">Start with a PDF</Link>
              </Button>
              <Button variant="outline" className="rounded-full" asChild>
                <Link href="/signup">Sign in with Google</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div>
                <div className="text-base font-semibold text-foreground">2 min</div>
                Avg. setup time
              </div>
              <div>
                <div className="text-base font-semibold text-foreground">4x</div>
                Faster review cycles
              </div>
              <div>
                <div className="text-base font-semibold text-foreground">1 click</div>
                Relationship graph
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -rotate-2 rounded-[32px] bg-linear-to-br from-orange-200/70 via-white to-rose-100 shadow-lg" />
            <div className="relative rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-foreground">Project Atlas Report</div>
                  <div className="text-xs text-muted-foreground">Uploaded 2 minutes ago</div>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700">
                  Ready
                </span>
              </div>
              <div className="mt-6 space-y-3">
                <div className="rounded-2xl bg-orange-50 px-4 py-3 text-sm text-foreground">
                  Highlight the top three risks in section 4.
                </div>
                <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-foreground">
                  1) Vendor lock-in, 2) Compliance delays, 3) Data transfer costs. Want citations?
                </div>
                <div className="rounded-2xl border border-dashed border-foreground/10 px-4 py-3 text-xs text-muted-foreground">
                  Generate relationship map
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                <div className="rounded-xl border border-foreground/10 bg-white px-3 py-2 text-center">
                  128 nodes
                </div>
                <div className="rounded-xl border border-foreground/10 bg-white px-3 py-2 text-center">
                  246 links
                </div>
                <div className="rounded-xl border border-foreground/10 bg-white px-3 py-2 text-center">
                  8 themes
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Features</div>
            <h2 className="text-3xl font-semibold">Everything you need to learn, synthesize, and share.</h2>
            <p className="text-base text-muted-foreground">
              Rimiacey turns static PDFs into interactive conversations. Keep your context,
              get precise answers, and visualize relationships instantly.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-foreground/10 bg-white/80 p-4 shadow-sm"
              >
                <div className="text-base font-semibold">{feature.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="flow" className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-6">
        <div className="rounded-[28px] border border-foreground/10 bg-white/70 p-6 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Workflow</div>
              <h2 className="mt-2 text-3xl font-semibold">Three steps to clarity.</h2>
            </div>
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/dashboard">Open workspace</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl bg-linear-to-br from-white via-white to-orange-50 p-5 shadow-sm"
              >
                <div className="text-xs text-muted-foreground">Step {index + 1}</div>
                <div className="mt-2 text-lg font-semibold">{step.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="examples" className="mx-auto w-full max-w-6xl px-4 pb-20 md:px-6">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Examples</div>
            <h2 className="text-3xl font-semibold">Ask better questions, get sharper answers.</h2>
            <p className="text-base text-muted-foreground">
              Great prompts unlock better insights. Start with these and adjust
              as you learn the document.
            </p>
          </div>
          <div className="space-y-3">
            {examples.map((example) => (
              <div
                key={example}
                className="rounded-2xl border border-foreground/10 bg-white/80 px-4 py-3 text-sm text-foreground shadow-sm"
              >
                {example}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="border-t border-foreground/10 bg-white/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-4 py-14 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Ready</div>
            <h2 className="mt-2 text-3xl font-semibold">Bring your next PDF to life.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90" asChild>
              <Link href="/dashboard">Start now</Link>
            </Button>
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/signup">Connect Google</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
