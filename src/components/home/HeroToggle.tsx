"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { FiEdit3, FiBriefcase } from "react-icons/fi";
import { WordsPullUp } from "@/components/motion/WordsPullUp";
import { Reveal } from "@/components/motion/Reveal";

export type Audience = "write" | "hire";

const COPY: Record<Audience, { kicker: string; heading: string[]; body: string; primary: { href: string; label: string }; secondary: { href: string; label: string } }> = {
    write: {
        kicker: "A platform, only for tech",
        heading: ["Write, connect, and", "get read — for real"],
        body: "Long-form technical posts, a following that actually reads what you write, and a community built for people who ship — not a repurposed generic blog template.",
        primary: { href: "/register", label: "Start writing" },
        secondary: { href: "/feed", label: "Explore posts" },
    },
    hire: {
        kicker: "Delivered by the team behind the platform",
        heading: ["A dev team that ships", "on the date it commits to"],
        body: "Contract-based web and software development, consulting, and digital marketing — run by the same team that builds and writes on this platform every day.",
        primary: { href: "#contact", label: "Talk to us about a project" },
        secondary: { href: "#work", label: "See client work" },
    },
};

/**
 * Takes both pre-built section orderings as plain ReactNode props (built
 * server-side in page.tsx) and picks which to render based on client state.
 * Passing a function as children across the server/client boundary isn't
 * valid RSC — props must serialize to JSX, not a callback — so the ordering
 * decision has to happen here, not via a render-prop.
 */
export function AudienceSections({
    writeContent,
    hireContent,
}: {
    writeContent: ReactNode;
    hireContent: ReactNode;
}) {
    const [audience, setAudience] = useState<Audience>("write");
    return (
        <>
            <HeroToggleUI audience={audience} onChange={setAudience} />
            {audience === "hire" ? hireContent : writeContent}
        </>
    );
}

function HeroToggleUI({ audience, onChange }: { audience: Audience; onChange: (a: Audience) => void }) {
    const copy = COPY[audience];

    return (
        <div className="flex justify-center items-center">
            <div className="hero-glow relative overflow-hidden px-6 pb-20 pt-24">
                <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
                    {/* The toggle itself — this is the signature element */}
                    <Reveal className="inline-flex rounded-full border border-border bg-card p-1">
                        <button
                            onClick={() => onChange("write")}
                            aria-pressed={audience === "write"}
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${audience === "write"
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <FiEdit3 className="h-4 w-4" />
                            I'm here to write
                        </button>
                        <button
                            onClick={() => onChange("hire")}
                            aria-pressed={audience === "hire"}
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${audience === "hire"
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <FiBriefcase className="h-4 w-4" />
                            I'm here to hire
                        </button>
                    </Reveal>

                    <span key={`kicker-${audience}`} className="font-mono-kicker text-accent">
                        {copy.kicker}
                    </span>

                    <h1 key={`heading-${audience}`} className="font-display text-5xl font-semibold leading-[1.05] sm:text-6xl">
                        <WordsPullUp text={copy.heading[0]} />
                        <br />
                        <WordsPullUp text={copy.heading[1]} delayStep={0.06} />
                    </h1>

                    <Reveal key={`body-${audience}`} delay={0.3}>
                        <p className="max-w-xl text-lg text-muted-foreground">{copy.body}</p>
                    </Reveal>

                    <Reveal key={`cta-${audience}`} delay={0.45} className="mt-2 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href={copy.primary.href}
                            className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90"
                        >
                            {copy.primary.label}
                        </Link>
                        <Link
                            href={copy.secondary.href}
                            className="rounded-md border border-border px-6 py-3 text-sm font-medium hover:bg-muted"
                        >
                            {copy.secondary.label}
                        </Link>
                    </Reveal>
                </div>
            </div>
        </div>
    );
}