import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { WordsPullUp } from "@/components/motion/WordsPullUp";

/**
 * Deliberately no fake job listings here — inventing open roles that
 * don't exist would be actively misleading, unlike the placeholder
 * testimonials/case-studies (which are clearly marked as such and
 * meant to be replaced with real content of the same shape). If real
 * roles open up, this is where they'd get listed properly.
 */
const VALUES = [
    {
        title: "Small and hands-on",
        description: "Everyone here works directly on real projects — no layer of people who only manage.",
    },
    {
        title: "We use what we build",
        description:
            "Tech2Xplore the platform is our own testing ground. If it's not good enough for us to run our own consultancy on, it's not good enough to ship to a client.",
    },
    {
        title: "Direct communication",
        description: "Flag problems early, explain tradeoffs honestly, and don't dress up bad news to make it easier to hear.",
    },
];

export default function CareersPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
            <Reveal>
                <p className="font-mono-kicker text-muted-foreground">Careers</p>
                <h1 className="mt-2">
                    <WordsPullUp
                        text="We're not actively hiring right now"
                        className="font-display text-3xl font-semibold sm:text-4xl"
                    />
                </h1>
                <p className="mt-4 text-muted-foreground">
                    We're still a small, hands-on team — but that changes as the consultancy grows. If that's
                    something you'd want to be part of, we'd rather hear from you now than lose your details.
                </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-12">
                <p className="font-mono-kicker text-muted-foreground">What we value</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    {VALUES.map((value) => (
                        <div key={value.title} className="rounded-xl border border-border bg-card p-5">
                            <p className="text-sm font-medium">{value.title}</p>
                            <p className="mt-1.5 text-sm text-muted-foreground">{value.description}</p>
                        </div>
                    ))}
                </div>
            </Reveal>

            <Reveal delay={0.2} className="mt-12 rounded-xl border border-border bg-card p-8 text-center">
                <p className="font-display text-lg font-semibold">Want to stay on our radar?</p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                    Send us a note — what you do, what you're looking for — and we'll reach out when something
                    opens up that fits.
                </p>
                <Link
                    href="/contact"
                    className="mt-5 inline-block rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90"
                >
                    Get in touch
                </Link>
            </Reveal>
        </div>
    );
}