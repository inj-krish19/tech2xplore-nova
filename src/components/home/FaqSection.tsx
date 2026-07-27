"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Reveal } from "@/components/motion/Reveal";
import { WordsPullUp } from "@/components/motion/WordsPullUp";

const FAQS = [
    {
        q: "Do you sign NDAs?",
        a: "Yes — happy to sign one before any project details are shared.",
    },
    {
        q: "What if the scope changes mid-project?",
        a: "We re-scope and re-quote the changed piece rather than silently absorbing it into the original timeline — you'll always know what a change costs before it happens.",
    },
    {
        q: "Do you work with an existing dev team, or only greenfield builds?",
        a: "Both — we regularly work inside an existing codebase alongside an in-house team, not just standalone builds.",
    },
    {
        q: "What does a typical timeline look like?",
        a: "Depends on scope — we give you a fixed date during the Scope step, before any contract is signed, not a rolling estimate.",
    },
    {
        q: "Is the platform (Tech2Xplore blogging) connected to the services side?",
        a: "Same team, same brand, separate products — writing on the platform doesn't require hiring us, and hiring us doesn't require using the platform.",
    },
];

export function FaqSection() {
    const [open, setOpen] = useState<number | null>(0);

    return (
        <section id="faq" className="border-t border-border px-6 py-20">
            <div className="mx-auto max-w-3xl">
                <Reveal>
                    <p className="font-mono-kicker text-muted-foreground">Before you reach out</p>
                    <h2 className="mt-2 font-display text-3xl font-semibold">
                        <WordsPullUp text="Questions worth answering upfront" />
                    </h2>
                </Reveal>

                <div className="mt-10 divide-y divide-border rounded-xl border border-border bg-card">
                    {FAQS.map((faq, i) => {
                        const isOpen = open === i;
                        return (
                            <div key={faq.q}>
                                <button
                                    onClick={() => setOpen(isOpen ? null : i)}
                                    aria-expanded={isOpen}
                                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                                >
                                    <span className="font-display text-base font-medium">{faq.q}</span>
                                    <FiPlus
                                        className={`h-4 w-4 shrink-0 text-accent transition-transform duration-200 ${isOpen ? "rotate-45" : ""
                                            }`}
                                    />
                                </button>
                                <div
                                    className={`grid transition-all duration-200 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                        }`}
                                >
                                    <div className="overflow-hidden">
                                        <p className="px-6 pb-4 text-sm text-muted-foreground">{faq.a}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}