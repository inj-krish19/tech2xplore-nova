import Link from "next/link";
import { FiCode, FiTrendingUp, FiSettings } from "react-icons/fi";
import { VscMegaphone } from "react-icons/vsc"
import { Reveal } from "@/components/motion/Reveal";
import { WordsPullUp } from "@/components/motion/WordsPullUp";

const SERVICES = [
    {
        icon: FiCode,
        title: "Web & Software Development",
        description:
            "Contract-based product builds — from a founder's first MVP to rebuilding a legacy system properly, the way this platform itself was rebuilt.",
        includes: [
            "Full-stack web apps (Next.js, React, or your existing stack)",
            "Legacy system rebuilds and migrations",
            "API design and backend architecture",
            "Ongoing feature development for an existing codebase",
        ],
    },
    {
        icon: FiSettings,
        title: "Consulting",
        description:
            "Sometimes the fastest fix isn't more code — it's a second set of eyes on a decision before it's expensive to reverse.",
        includes: [
            "Architecture and tech-stack review",
            "Performance and scaling audits",
            "Code review and technical due diligence",
            "Unblocking a stuck internal team",
        ],
    },
    {
        icon: VscMegaphone,
        title: "Digital Marketing",
        description:
            "Technical marketing that understands the product, not generic campaign templates.",
        includes: [
            "Content strategy for technical audiences",
            "SEO for developer-facing products",
            "Launch planning and positioning",
        ],
    },
    {
        icon: FiTrendingUp,
        title: "Platform Promotion",
        description:
            "Getting a product in front of the people who'd actually use it — including the LinkedIn automation pipeline built for our own platform.",
        includes: [
            "Automated content distribution (LinkedIn and beyond)",
            "Community-building strategy",
            "Growth loops tailored to a technical product",
        ],
    },
];

export default function ServicesPage() {
    return (
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <Reveal>
                <p className="font-mono-kicker text-muted-foreground">What We Do</p>
                <h1 className="mt-2 max-w-2xl">
                    <WordsPullUp
                        text="Beyond the platform — the services behind it"
                        className="font-display text-3xl font-semibold sm:text-4xl"
                    />
                </h1>
                <p className="mt-4 max-w-xl text-muted-foreground">
                    Four things we actually do, not a generic agency menu. If your project doesn't cleanly fit one of
                    these, tell us about it anyway — most real projects are a mix.
                </p>
            </Reveal>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
                {SERVICES.map((service, i) => (
                    <Reveal key={service.title} delay={0.05 * i}>
                        <div className="tilt-card flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
                                <service.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-display text-lg font-semibold">{service.title}</p>
                                <p className="mt-1.5 text-sm text-muted-foreground">{service.description}</p>
                            </div>
                            <ul className="mt-auto flex flex-col gap-1.5 border-t border-border pt-4 text-sm text-muted-foreground">
                                {service.includes.map((item) => (
                                    <li key={item} className="flex gap-2">
                                        <span className="text-accent">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Reveal>
                ))}
            </div>

            <Reveal delay={0.2} className="mt-14 rounded-xl border border-border bg-card p-8 text-center">
                <p className="font-display text-xl font-semibold">Not sure which of these fits?</p>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                    Most real engagements are a mix of two or three of these. Tell us what you're working on and
                    we'll figure out the shape of it together.
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