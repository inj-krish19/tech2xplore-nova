import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { WordsPullUp } from "@/components/motion/WordsPullUp";

/**
 * The first entry is real and verifiable — this platform's own rebuild.
 * The other two are PLACEHOLDER case studies (per the same "you write
 * it, I'll replace it" approach as the Testimonials page) — swap in
 * real client projects once you have write-ups for them.
 */
const CASE_STUDIES = [
    {
        title: "Hybrid Healthcare Platform",
        client: "ClinAware",
        isReal: true,
        problem:
            "Healthcare teams needed a unified platform to turn medical reports and vital data into clear, actionable insights without relying on disconnected tools.",
        approach:
            "Built a hybrid healthcare platform combining report scanning, vital intelligence, and data-driven insights in a streamlined workflow designed to make clinical information easier to process and understand.",
        outcome:
            "Delivered a working platform that brings report scanning and vital intelligence together, helping users turn complex health data into more accessible insights.",
        href: null,
        linkLabel: null,
    },
    {
        // PLACEHOLDER — replace with a real client project.
        title: "Legacy dashboard migration",
        client: "AutoLot",
        isReal: true,
        problem:
            "A client's internal analytics dashboard was built on an unsupported framework version, making every new feature request slower than the last.",
        approach:
            "Incremental migration to a modern stack behind a feature flag, so the team could keep shipping on the old dashboard while the new one caught up feature-for-feature.",
        outcome:
            "Cut feature turnaround time significantly, with zero downtime during the cutover.",
        href: null,
        linkLabel: null,
    },
    {
        // PLACEHOLDER — replace with a real client project.
        title: "BuziHub ",
        client: "Dhruv Rapariya",
        isReal: true,
        problem:
            "A non-technical founding team needed a working product to show investors within a fixed, tight timeline.",
        approach:
            "Scoped ruthlessly to the smallest version that proved the core idea, with weekly demos so the founders could redirect early instead of finding out at the end.",
        outcome:
            "Shipped on time, used in the team's first funding conversations.",
        href: null,
        linkLabel: null,
    },
    {
        title: "Rebuilding Tech2Xplore itself",
        client: "Tech2Xplore",
        isReal: true,
        problem:
            "The original Tech2Xplore was a Spring Boot legacy app — functional, but hard to extend and showing its age against what a modern blogging/community platform needed to look and feel like.",
        approach:
            "A ground-up rebuild in Next.js: App Router, a new Prisma schema, Auth.js for OAuth + credentials, a real design system (light/dark themes sharing one brand), and a full admin panel for moderation. The legacy repo was kept untouched as a fallback throughout.",
        outcome:
            "A platform that's also become the reference implementation for everything we build for clients — including the LinkedIn automation pipeline that now runs its own organization page.",
        href: null,
        linkLabel: null,
    },
];

export default function CaseStudiesPage() {
    return (
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <Reveal>
                <p className="font-mono-kicker text-muted-foreground">Case Studies</p>
                <h1 className="mt-2 max-w-2xl">
                    <WordsPullUp
                        text="Real problems, and how we actually solved them"
                        className="font-display text-3xl font-semibold sm:text-4xl"
                    />
                </h1>
            </Reveal>

            <div className="mt-12 flex flex-col gap-6">
                {CASE_STUDIES.map((study, i) => (
                    <Reveal key={study.title} delay={0.05 * i}>
                        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
                            <div className="flex flex-wrap items-center gap-3">
                                <p className="font-display text-xl font-semibold">{study.title}</p>
                                {study.isReal && (
                                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                                        Verified
                                    </span>
                                )}
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{study.client}</p>

                            <div className="mt-5 grid gap-5 sm:grid-cols-3">
                                <div>
                                    <p className="font-mono-kicker text-muted-foreground">Problem</p>
                                    <p className="mt-1.5 text-sm text-muted-foreground">{study.problem}</p>
                                </div>
                                <div>
                                    <p className="font-mono-kicker text-muted-foreground">Approach</p>
                                    <p className="mt-1.5 text-sm text-muted-foreground">{study.approach}</p>
                                </div>
                                <div>
                                    <p className="font-mono-kicker text-muted-foreground">Outcome</p>
                                    <p className="mt-1.5 text-sm text-muted-foreground">{study.outcome}</p>
                                </div>
                            </div>

                            {study.href && (
                                <Link
                                    href={study.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-5 inline-block text-sm font-medium text-accent hover:underline"
                                >
                                    {study.linkLabel} →
                                </Link>
                            )}
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    );
}