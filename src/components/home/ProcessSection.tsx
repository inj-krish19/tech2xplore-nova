import { Reveal } from "@/components/motion/Reveal";
import { WordsPullUp } from "@/components/motion/WordsPullUp";

/**
 * This is one of the few places a numbered sequence is actually earned —
 * these steps happen in this order, every engagement, so the numbering
 * encodes real information rather than decorating a grid of cards.
 */
const STEPS = [
    {
        n: "01",
        title: "Discover",
        body: "A working call to understand the problem, not just the feature list — what the project needs to be true when it's done.",
    },
    {
        n: "02",
        title: "Scope",
        body: "A fixed timeline and deliverables in writing before anything gets built — so there's a date to hold each other to.",
    },
    {
        n: "03",
        title: "Build",
        body: "Regular check-ins against the plan, not a black box for six weeks and a surprise at the end.",
    },
    {
        n: "04",
        title: "Deliver",
        body: "Shipped on the date we committed to, with the same team that scoped it — no handoff to people you've never met.",
    },
];

export function ProcessSection() {
    return (
        <section id="process" className="border-t border-border bg-muted px-6 py-20">
            <div className="mx-auto max-w-6xl">
                <Reveal>
                    <p className="font-mono-kicker text-muted-foreground">How an engagement runs</p>
                    <h2 className="mt-2 font-display text-3xl font-semibold">
                        <WordsPullUp text="Four steps, one team, no handoffs" />
                    </h2>
                </Reveal>

                <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
                    {STEPS.map((step, i) => (
                        <Reveal key={step.n} delay={i * 0.1} className="bg-card p-6">
                            <p className="font-mono-kicker text-accent">{step.n}</p>
                            <h3 className="mt-2 font-display text-lg font-semibold">{step.title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}