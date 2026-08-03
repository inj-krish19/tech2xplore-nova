import { Reveal } from "@/components/motion/Reveal";
import { WordsPullUp } from "@/components/motion/WordsPullUp";
import { Accordion } from "@/components/marketing/Accordion";

const FAQ_ITEMS = [
    {
        question: "What's the actual engagement process?",
        answer:
            "A short discovery call to understand what you need, a written scope (fixed-scope projects) or a proposed retainer shape (ongoing work), then we start. No lengthy sales process before you get real answers.",
    },
    {
        question: "How long do projects typically take?",
        answer:
            "Depends entirely on scope — a focused MVP can be weeks, a full platform rebuild (like our own) is a longer arc. We'll give you a real estimate after discovery, not a generic range.",
    },
    {
        question: "What tech stack do you work with?",
        answer:
            "Next.js/React/TypeScript is our strongest default — it's what this platform itself runs on — but we're not precious about it. If your existing codebase is in something else, tell us and we'll be upfront about fit.",
    },
    {
        question: "How does billing work?",
        answer:
            "Fixed-scope projects are billed against agreed milestones. Retainers are billed monthly. Hourly consulting is billed for actual time spent, tracked transparently. See the Pricing page for how these models differ.",
    },
    {
        question: "Do you sign NDAs before discussing a project?",
        answer:
            "Yes — a mutual NDA before any real project details are shared is standard practice for us, not something you need to ask for.",
    },
    {
        question: "Who owns the code after the project is done?",
        answer:
            "You do. IP assignment on delivered work is a standard term in our service agreement, not something negotiated after the fact.",
    },
    {
        question: "Can you take over an existing codebase mid-project?",
        answer:
            "Yes — this is a common starting point for us, not an edge case. We'll do an honest assessment of what's there before committing to a timeline on top of it.",
    },
];

export default function FAQPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
            <Reveal>
                <p className="font-mono-kicker text-muted-foreground">FAQ</p>
                <h1 className="mt-2">
                    <WordsPullUp
                        text="Questions we actually get asked"
                        className="font-display text-3xl font-semibold sm:text-4xl"
                    />
                </h1>
            </Reveal>

            <Reveal delay={0.1} className="mt-10">
                <Accordion items={FAQ_ITEMS} />
            </Reveal>
        </div>
    );
}