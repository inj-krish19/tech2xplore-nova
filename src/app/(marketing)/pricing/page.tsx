import Link from "next/link";
import { FiCheck } from "react-icons/fi";
import { Reveal } from "@/components/motion/Reveal";
import { WordsPullUp } from "@/components/motion/WordsPullUp";

/**
 * Deliberately no dollar figures here — actual pricing is a business
 * decision, not something to invent. These are engagement *models*;
 * add real numbers once they're decided, either here directly or by
 * linking each "Get a quote" through to a form that captures budget
 * range instead of publishing a fixed rate card.
 */
const MODELS = [
    {
        title: "Fixed-Scope Project",
        subtitle: "Best for a defined deliverable",
        description: "A clear spec, a clear timeline, one price agreed before work starts.",
        points: [
            "Scoped after an initial discovery call",
            "Fixed price, fixed timeline",
            "Best when requirements are already clear",
        ],
        highlighted: false,
    },
    {
        title: "Retainer",
        subtitle: "Best for ongoing work",
        description: "A set number of hours or a set scope each month, for work that doesn't have a finish line.",
        points: [
            "Predictable monthly commitment",
            "Priority turnaround on requests",
            "Best for ongoing feature work or maintenance",
        ],
        highlighted: true,
    },
    {
        title: "Hourly Consulting",
        subtitle: "Best for a specific question",
        description: "Architecture review, a second opinion, unblocking a stuck decision — billed for the time it takes.",
        points: [
            "No minimum commitment",
            "Ideal for audits and one-off advice",
            "Scales down to a single session if that's all you need",
        ],
        highlighted: false,
    },
];

export default function PricingPage() {
    return (
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <Reveal>
                <p className="font-mono-kicker text-muted-foreground">Pricing</p>
                <h1 className="mt-2 max-w-2xl">
                    <WordsPullUp
                        text="How engagements are structured"
                        className="font-display text-3xl font-semibold sm:text-4xl"
                    />
                </h1>
                <p className="mt-4 max-w-xl text-muted-foreground">
                    We don't publish a fixed rate card — every project is different enough that a number here would
                    either be misleading or meaningless. What we can tell you upfront is how engagements are shaped.
                </p>
            </Reveal>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
                {MODELS.map((model, i) => (
                    <Reveal key={model.title} delay={0.05 * i}>
                        <div
                            className={`flex h-full flex-col gap-4 rounded-xl border p-6 ${model.highlighted ? "border-accent bg-accent/5" : "border-border bg-card"
                                }`}
                        >
                            <div>
                                <p className="font-display text-lg font-semibold">{model.title}</p>
                                <p className="text-xs text-accent">{model.subtitle}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">{model.description}</p>
                            <ul className="mt-auto flex flex-col gap-2 border-t border-border pt-4 text-sm text-muted-foreground">
                                {model.points.map((point) => (
                                    <li key={point} className="flex gap-2">
                                        <FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Reveal>
                ))}
            </div>

            <Reveal delay={0.2} className="mt-14 rounded-xl border border-border bg-card p-8 text-center">
                <p className="font-display text-xl font-semibold">Get a real number for your project</p>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                    Tell us what you're building and roughly what you have to work with — we'll tell you honestly
                    which model fits and what it'd actually cost.
                </p>
                <Link
                    href="/contact"
                    className="mt-5 inline-block rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90"
                >
                    Get a quote
                </Link>
            </Reveal>
        </div>
    );
}