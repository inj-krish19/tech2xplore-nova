import { Reveal } from "@/components/motion/Reveal";
import { WordsPullUp } from "@/components/motion/WordsPullUp";
import { StarRating } from "@/components/ui/StarRating";

/**
 * PLACEHOLDER CONTENT — every name, company, quote, and photo below is
 * fictional/dummy, per request ("you write it and attach profile
 * picture ... I'll change it"). Avatar URLs are from a public placeholder
 * avatar service (i.pravatar.cc), not real client photos. Swap all of
 * this for real testimonials + real photos before this goes live.
 */
const TESTIMONIALS = [
    {
        name: "Dhruv Rapariya",
        role: "Co-founder, BuziHub",
        photo: "https://avatars.githubusercontent.com/u/172275552?v=4",
        rating: 5,
        quote: "When our platform's social presence was struggling, the team stepped in and transformed it. Their digital marketing strategies significantly boosted our engagement, helping us achieve over 17K+ impressions and a much stronger online presence.",
    },
    {
        name: "Rahil Koshti",
        role: "CEO, Book Your EV",
        photo: "https://avatars.githubusercontent.com/u/138675780?v=4",
        rating: 4,
        quote: "Hats off to the team for handling our urgent legacy application migration. They successfully rebuilt the application and delivered it on time without compromising on quality. Their professionalism and commitment were truly impressive.",
    },
    {
        name: "Priya Nair",
        role: "Product Lead, Bramble Analytics",
        photo: "https://i.pravatar.cc/150?img=47",
        rating: 5,
        quote: "We came in with a rough idea and a tight deadline. The team shipped a working MVP faster than our own internal estimate, and didn't cut corners doing it — the codebase we inherited was actually maintainable.",
    },
    {
        name: "Daniel Ochoa",
        role: "Founder, Northwind Labs",
        photo: "https://i.pravatar.cc/150?img=14",
        rating: 5,
        quote: "What stood out wasn't just the delivery speed — it was how much they pushed back on scope creep in our favor. They'd rather ship the right thing late by a day than the wrong thing on time.",
    },
    {
        name: "Meera Iyer",
        role: "CTO, Loopstack",
        photo: "https://i.pravatar.cc/150?img=26",
        rating: 4,
        quote: "Solid technical judgment and clear communication throughout. A couple of milestones slipped, but they flagged it early instead of surprising us at the deadline, which made planning around it easy.",
    },
    {
        name: "Tomás Reyes",
        role: "Head of Growth, Verdant",
        photo: "https://i.pravatar.cc/150?img=51",
        rating: 5,
        quote: "The consulting engagement paid for itself in the first month — they found performance issues in our stack we didn't even know to look for, and fixed them without a single production incident.",
    },
    {
        name: "Ananya Desai",
        role: "Founder, Fernlight Studio",
        photo: "https://i.pravatar.cc/150?img=32",
        rating: 5,
        quote: "As a non-technical founder, what I needed most was someone who'd explain tradeoffs instead of just making decisions for me. That's exactly what I got, every step of the way.",
    },
    {
        name: "James Whitfield",
        role: "Engineering Manager, Corvus Systems",
        photo: "https://i.pravatar.cc/150?img=59",
        rating: 4,
        quote: "Good collaborators, not just good coders. They fit into our existing workflow instead of asking us to fit into theirs, which made the whole engagement far less friction than past contractors.",
    },
];

const STATS = [
    { label: "Average client rating", value: "4.6 / 5", sub: "across 5+ completed engagements" },
    { label: "Clients served", value: "5+", sub: "and growing" },
    // PLACEHOLDER metric — replace with a real, defensible number
    // (on-time delivery rate, repeat-client rate, etc.) once you have one.
    { label: "Reliability score", value: "96%", sub: "on-time delivery across engagements" },
];

export default function TestimonialsPage() {
    return (
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <Reveal>
                <p className="font-mono-kicker text-muted-foreground">Testimonials</p>
                <h1 className="mt-2 max-w-2xl">
                    <WordsPullUp
                        text="Trusted by teams who needed it done right"
                        className="font-display text-3xl font-semibold sm:text-4xl"
                    />
                </h1>
                <p className="mt-4 max-w-xl text-muted-foreground">
                    A few words from clients we've built, shipped, and consulted with.
                </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-10 grid gap-4 sm:grid-cols-3">
                {STATS.map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-border bg-card p-6 text-center">
                        <p className="font-display text-3xl font-semibold text-accent">{stat.value}</p>
                        <p className="mt-1 text-sm font-medium">{stat.label}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{stat.sub}</p>
                    </div>
                ))}
            </Reveal>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {TESTIMONIALS.map((t, i) => (
                    <Reveal key={t.name} delay={0.05 * i}>
                        <div className="tilt-card flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-6">
                            <StarRating rating={t.rating} />
                            <p className="flex-1 text-sm text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                            <div className="flex items-center gap-3 border-t border-border pt-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={t.photo} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">{t.name}</p>
                                    <p className="truncate text-xs text-muted-foreground">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    );
}