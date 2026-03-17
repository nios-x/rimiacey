import Link from "next/link";
import { Button } from "@/components/ui/button";

const highlightStats = [
  { label: "Setup time", value: "90 sec" },
  { label: "Avg. accuracy", value: "98%" },
  { label: "Docs indexed", value: "1.2M" },
];

const featureCards = [
  {
    title: "Context-aware answers",
    description:
      "Keep every answer grounded in your PDFs with citations, memory, and follow-ups that retain nuance.",
  },
  {
    title: "Visual relationship maps",
    description:
      "Generate concept graphs, explore clusters, and surface hidden dependencies in seconds.",
  },
  {
    title: "Team-ready workspaces",
    description:
      "Invite teammates, share collections, and keep decisions aligned with a single source of truth.",
  },
  {
    title: "Fast document intake",
    description:
      "Drop reports, transcripts, or manuals and get an indexed knowledge base with zero setup.",
  },
  {
    title: "Guided prompt kits",
    description:
      "Use expert-crafted prompt templates to extract risks, timelines, and key insights.",
  },
  {
    title: "Secure by design",
    description:
      "Private storage, controlled access, and audit-ready exports built in from day one.",
  },
];

const workflows = [
  {
    title: "Upload + index",
    description: "PDFs are chunked, embedded, and stored in your workspace library.",
  },
  {
    title: "Ask + iterate",
    description: "Chat naturally, request citations, and refine answers in seconds.",
  },
  {
    title: "Map + share",
    description: "Generate visual graphs and export key findings with collaborators.",
  },
];

const useCases = [
  "Investor diligence and market research",
  "Policy, compliance, and legal review",
  "Product docs and onboarding handbooks",
  "Academic papers and thesis work",
  "Customer interviews and UX research",
  "Knowledge transfer across teams",
];

const testimonials = [
  {
    name: "Maya Patel",
    role: "Head of Research, Quantloop",
    quote:
      "Rimiacey turned a 200-page report into a clear decision brief in under an hour.",
  },
  {
    name: "Elliot Reyes",
    role: "Product Lead, CivicWorks",
    quote:
      "We finally have a shared brain for all of our PDFs. The graph view is a game changer.",
  },
];

export default function Homepage() {
  return (
    <main className="noise-bg">
      <section className="relative overflow-hidden">
        <div className="absolute left-[-20%] top-[-30%] h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(14,116,144,0.4),transparent_70%)] blur-3xl" />
        <div className="absolute right-[-10%] top-[-20%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.35),transparent_70%)] blur-3xl" />

        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-6 md:py-24">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-white/80 px-4 py-1 text-xs text-muted-foreground">
              Built for research teams, founders, and students
            </div>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              PDFs become living knowledge when your team can chat, map, and share.
            </h1>
            <p className="text-base text-muted-foreground md:text-lg">
              Rimiacey transforms static documents into a collaborative workspace. Upload once,
              ask anything, and visualize how every concept connects.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90" asChild>
                <Link href="/dashboard">Launch workspace</Link>
              </Button>
              <Button variant="outline" className="rounded-full" asChild>
                <Link href="/pricing">View pricing</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {highlightStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-foreground/10 bg-white/80 px-4 py-3">
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  <div className="text-xl font-semibold text-foreground">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -rotate-1 rounded-[32px] bg-linear-to-br from-teal-100 via-white to-amber-50" />
            <div className="relative rounded-[28px] border border-white/70 bg-white/80 p-6 backdrop-blur">
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
                <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-foreground">
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

      <section className="mx-auto w-full max-w-6xl px-4 pb-10 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-foreground/10 bg-white/70 px-6 py-5">
          <div className="text-sm text-muted-foreground">Trusted by teams in research, policy, and product</div>
          <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <span>Atlas</span>
            <span>Norhive</span>
            <span>Veridian</span>
            <span>Relay</span>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6">
        <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Why Rimiacey</div>
            <h2 className="text-3xl font-semibold">A full PDF intelligence stack, built for teams.</h2>
            <p className="text-base text-muted-foreground">
              Rimiacey helps you transform dense documents into shared knowledge. It blends chat,
              summaries, and visual maps in one workspace so teams can move from reading to decisions.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featureCards.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-foreground/10 bg-white/80 p-5">
                <div className="text-base font-semibold">{feature.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-6">
        <div className="rounded-[28px] border border-foreground/10 bg-white/70 p-6 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Workflow</div>
              <h2 className="mt-2 text-3xl font-semibold">From upload to insight in minutes.</h2>
            </div>
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/features">Explore features</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {workflows.map((flow, index) => (
              <div key={flow.title} className="rounded-2xl bg-linear-to-br from-white via-white to-amber-50 p-5">
                <div className="text-xs text-muted-foreground">Step {index + 1}</div>
                <div className="mt-2 text-lg font-semibold">{flow.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{flow.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-6">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Use cases</div>
            <h2 className="text-3xl font-semibold">Built for every document-heavy team.</h2>
            <p className="text-base text-muted-foreground">
              Whether you are synthesizing policy, analyzing research, or onboarding teams,
              Rimiacey keeps everyone aligned with the same source of truth.
            </p>
          </div>
          <div className="grid gap-3">
            {useCases.map((useCase) => (
              <div
                key={useCase}
                className="rounded-2xl border border-foreground/10 bg-white/80 px-4 py-3 text-sm text-foreground"
              >
                {useCase}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-6">
        <div className="grid gap-6 rounded-[28px] border border-foreground/10 bg-white/70 p-8 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="rounded-2xl bg-white/80 p-5">
              <div className="text-sm text-muted-foreground">{testimonial.role}</div>
              <div className="mt-3 text-lg font-semibold">"{testimonial.quote}"</div>
              <div className="mt-4 text-sm font-medium">{testimonial.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-foreground/10 bg-white/80">
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

