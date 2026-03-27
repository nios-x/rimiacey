"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

const svgSignals = [
  {
    title: "Live signals",
    description: "Queries stay tethered to the freshest passages in your library.",
    accent: "from-sky-100 via-white to-emerald-50",
    path: "M4 14c2.4-4.2 5.6-6.3 9.2-6.2 3.6.1 6.6 2.4 8.8 6.9",
  },
  {
    title: "Graph pulse",
    description: "Concept clusters redraw as soon as new PDFs land -- no stale edges.",
    accent: "from-emerald-100 via-white to-amber-50",
    path: "M5 10.5 9.5 7 13 10.5 17 8l2 9H5z",
  },
  {
    title: "Safe lanes",
    description: "Exports stay PII-aware with audit-ready routing baked in.",
    accent: "from-amber-100 via-white to-sky-50",
    path: "M5 12c0-3.9 3.1-7 7-7s7 3.1 7 7-3.1 7-7 7-7-3.1-7-7zm7-4v8m-4-4h8",
  },
];

export default function Homepage() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cursorHaloRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from("[data-animate='hero'] > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power2.out",
      });

      gsap.utils.toArray<HTMLElement>("[data-animate='section']").forEach((section) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
          y: 28,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-animate='card']").forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
          y: 22,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        });
      });

      gsap.to("[data-blob='left']", {
        yPercent: 10,
        xPercent: 4,
        scrollTrigger: {
          trigger: "[data-blob='left']",
          start: "top bottom",
          scrub: true,
        },
      });
      gsap.to("[data-blob='right']", {
        yPercent: -8,
        xPercent: -6,
        scrollTrigger: {
          trigger: "[data-blob='right']",
          start: "top bottom",
          scrub: true,
        },
      });

      gsap.to("[data-hero-card]", {
        y: -40,
        rotate: -1.5,
        scrollTrigger: {
          trigger: "[data-section='hero']",
          start: "top top",
          end: "bottom center",
          scrub: true,
        },
      });

      gsap.from("[data-animate='svg-card']", {
        scrollTrigger: {
          trigger: "[data-section='signals']",
          start: "top 80%",
        },
        y: 22,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out",
      });

      gsap.fromTo(
        "[data-scroll-progress]",
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "0% 50%",
          ease: "none",
          scrollTrigger: {
            trigger: "[data-section='signals']",
            start: "top 80%",
            end: "bottom 30%",
            scrub: true,
          },
        }
      );

      gsap.utils.toArray<SVGPathElement>("[data-draw-path]").forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: path.closest("[data-svg-card]") || path,
            start: "top 85%",
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    const halo = cursorHaloRef.current;
    if (!cursor || !halo) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    gsap.set(cursor, { x: -100, y: -100, opacity: 0, scale: 0.7 });
    gsap.set(halo, { x: -100, y: -100, opacity: 0.2, scale: 1, rotate: 0.2 });

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.16, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.16, ease: "power3" });
    const haloXTo = gsap.quickTo(halo, "x", { duration: 0.24, ease: "power3" });
    const haloYTo = gsap.quickTo(halo, "y", { duration: 0.24, ease: "power3" });

    const move = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      haloXTo(e.clientX);
      haloYTo(e.clientY);
      gsap.to([cursor, halo], { opacity: 1, duration: 0.18, overwrite: "auto" });
    };

    const hoverTargets = gsap.utils.toArray<HTMLElement>("[data-hover]");
    const enter = () => {
      gsap.to(halo, {
        scale: 1.6,
        backgroundColor: "rgba(59,130,246,0.18)",
        borderColor: "rgba(59,130,246,0.45)",
        duration: 0.2,
        overwrite: "auto",
      });
      gsap.to(cursor, { scale: 0.9, duration: 0.16, overwrite: "auto" });
    };
    const leave = () => {
      gsap.to(halo, {
        scale: 1,
        backgroundColor: "rgba(255,255,255,0.12)",
        borderColor: "rgba(255,255,255,0.4)",
        duration: 0.25,
        overwrite: "auto",
      });
      gsap.to(cursor, { scale: 1, duration: 0.2, overwrite: "auto" });
    };

    window.addEventListener("mousemove", move);
    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      hoverTargets.forEach((el) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return (
    <main className="noise-bg">
      <div
        ref={cursorHaloRef}
        className="pointer-events-none fixed left-0 top-0 z-[9997] hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-white/10 blur-[1px] mix-blend-difference backdrop-blur-xl md:block"
      />
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-white/20 backdrop-blur md:block"
      />
      <section className="relative overflow-hidden" data-section="hero">
        <div
          data-blob="left"
          className="absolute left-[-20%] top-[-30%] h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(14,116,144,0.4),transparent_70%)] blur-3xl"
        />
        <div
          data-blob="right"
          className="absolute right-[-10%] top-[-20%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.35),transparent_70%)] blur-3xl"
        />

        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-6 md:py-24">
          <div className="space-y-6" data-animate="hero">
            <div className="lg:inline-flex hidden items-center gap-2 rounded-full border border-foreground/10 bg-white/80 px-4 py-[2px] text-xs text-muted-foreground">
              Built for research teams, founders, and students
            </div>
            <div className="py-7"></div>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              PDFs become living knowledge when your team can chat, map, and share.
            </h1>
            <p className="text-base text-muted-foreground md:text-lg">
              Rimiacey transforms static documents into a collaborative workspace. Upload once,
              ask anything, and visualize how every concept connects.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90" asChild data-hover>
                <Link href="/dashboard">Launch workspace</Link>
              </Button>
              <Button variant="outline" className="rounded-full" asChild data-hover>
                <Link href="/pricing">View pricing</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {highlightStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-foreground/10 bg-white/80 px-4 py-3" data-hover>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  <div className="text-xl font-semibold text-foreground">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative" data-animate="hero" data-hero-card data-hover>
            <div className="absolute inset-0 -rotate-1 rounded-[32px] bg-linear-to-br from-teal-100 via-white to-sky-50" />
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
                <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sm text-foreground">
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
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-foreground/10 bg-white/80 p-4" data-hover>
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-sm"
                  data-animate="svg"
                >
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>
                  <rect x="4" y="4" width="56" height="56" rx="14" stroke="url(#grad)" strokeWidth="2" fill="white" />
                  <path
                    d="M20 34 L28 42 L44 22"
                    data-draw-path
                    stroke="url(#grad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="60"
                    strokeDashoffset="60"
                  />
                  <circle cx="46" cy="20" r="3" fill="#22c55e" />
                </svg>
                <div className="text-sm text-muted-foreground">
                  Live check-ins track completion and keep teams aligned.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-10 md:px-6" data-animate="section">
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

      <section
        className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6"
        data-animate="section"
        data-section="signals"
      >
        <div className="rounded-[28px] border border-foreground/10 bg-white/80 p-6 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Animated signals</div>
              <h2 className="mt-2 text-3xl font-semibold">SVG icons that redraw as your stack moves.</h2>
            </div>
            <div className="max-w-md text-sm text-muted-foreground">
              Stroke animations and a scrubbed progress line show motion cues that stay in sync with ScrollTrigger.
            </div>
          </div>

          <div className="relative mt-8 grid gap-4 md:grid-cols-3">
            <span
              className="absolute left-0 right-0 top-0 h-[2px] rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-400"
              data-scroll-progress
            />
            {svgSignals.map((signal) => (
              <div
                key={signal.title}
                className={`group rounded-2xl border border-foreground/10 bg-linear-to-br ${signal.accent} p-4 shadow-sm`}
                data-animate="svg-card"
                data-svg-card
                data-hover
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{signal.title}</div>
                  <span className="text-xs text-muted-foreground transition duration-200 group-hover:text-foreground">
                    Live
                  </span>
                </div>
                <div className="mt-3">
                  <svg viewBox="0 0 24 24" className="h-16 w-full text-foreground/80" aria-hidden>
                    <path
                      d={signal.path}
                      data-draw-path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="6" cy="18" r="1" fill="currentColor" className="opacity-70" />
                    <circle cx="18" cy="6" r="1" fill="currentColor" className="opacity-70" />
                  </svg>
                  <p className="text-sm text-muted-foreground">{signal.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6" data-animate="section">
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
              <div
                key={feature.title}
                className="rounded-2xl border border-foreground/10 bg-white/80 p-5"
                data-animate="card"
                data-hover
              >
                <div className="text-base font-semibold">{feature.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-6" data-animate="section">
        <div className="rounded-[28px] border border-foreground/10 bg-white/70 p-6 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Workflow</div>
              <h2 className="mt-2 text-3xl font-semibold">From upload to insight in minutes.</h2>
            </div>
            <Button variant="outline" className="rounded-full" asChild data-hover>
              <Link href="/features">Explore features</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {workflows.map((flow, index) => (
              <div
                key={flow.title}
                className="rounded-2xl bg-linear-to-br from-white via-white to-sky-50 p-5"
                data-animate="card"
                data-hover
              >
                <div className="text-xs text-muted-foreground">Step {index + 1}</div>
                <div className="mt-2 text-lg font-semibold">{flow.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{flow.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-6" data-animate="section">
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
                data-animate="card"
                data-hover
              >
                {useCase}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-6" data-animate="section">
        <div className="grid gap-6 rounded-[28px] border border-foreground/10 bg-white/70 p-8 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-2xl bg-white/80 p-5"
              data-animate="card"
              data-hover
            >
              <div className="text-sm text-muted-foreground">{testimonial.role}</div>
              <div className="mt-3 text-lg font-semibold">"{testimonial.quote}"</div>
              <div className="mt-4 text-sm font-medium">{testimonial.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-foreground/10 bg-white/80" data-animate="section">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-4 py-14 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Ready</div>
            <h2 className="mt-2 text-3xl font-semibold">Bring your next PDF to life.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90" asChild data-hover>
              <Link href="/dashboard">Start now</Link>
            </Button>
            <Button variant="outline" className="rounded-full" asChild data-hover>
              <Link href="/signup">Connect Google</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

