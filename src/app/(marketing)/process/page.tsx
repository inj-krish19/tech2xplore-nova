import { FiPhoneCall, FiFileText, FiCode, FiSend, FiLifeBuoy } from "react-icons/fi";
import { Reveal } from "@/components/motion/Reveal";
import { WordsPullUp } from "@/components/motion/WordsPullUp";

const STEPS = [
    {
        icon: FiPhoneCall,
        title: "Discovery call",
        description:
            "A short, no-pressure conversation about what you're trying to build and why. We ask the questions that actually change scope, not a generic intake form.",
    },
    {
        icon: FiFileText,
        title: "Scoping & proposal",
        description:
            "A written scope you can hold us to — what's included, what isn't, and which engagement model (fixed-scope, retainer, or hourly) actually fits. An NDA comes first if we're discussing anything sensitive.",
    },
    {
        icon: FiCode,
        title: "Build",
        description:
            "Regular check-ins, not a black box until the deadline. You'll see progress as it happens, and we'll flag anything that changes the timeline the moment we know it — not the day it's due.",
    },
    {
        icon: FiSend,
        title: "Handoff & launch",
        description:
            "You get the code, the context, and the reasoning behind the decisions — not just a working build with no documentation. IP is yours; that's a standing term, not a negotiation.",
    },
    {
        icon: FiLifeBuoy,
        title: "Post-launch support",
        description:
            "Launch isn't the finish line. Whether that's a short warranty period, a support retainer, or just being reachable if something breaks — we'll agree on what that looks like before we start, not after.",
    },
];

export default function ProcessPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
            <Reveal>
                <p className="font-mono-kicker text-muted-foreground">How We Work</p>
                <h1 className="mt-2">
                    <WordsPullUp
                        text="What happens after you say yes"
                        className="font-display text-3xl font-semibold sm:text-4xl"
                    />
                </h1>
            </Reveal>

            <div className="mt-12 flex flex-col">
                {STEPS.map((step, i) => (
                    <Reveal key={step.title} delay={0.06 * i}>
                        <div className="flex gap-5">
                            <div className="flex flex-col items-center">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                                    <step.icon className="h-5 w-5" />
                                </div>
                                {i < STEPS.length - 1 && <div className="mt-1 w-px flex-1 bg-border" />}
                            </div>
                            <div className="pb-10">
                                <p className="font-mono-kicker text-muted-foreground">Step {i + 1}</p>
                                <p className="mt-1 font-display text-lg font-semibold">{step.title}</p>
                                <p className="mt-1.5 text-sm text-muted-foreground">{step.description}</p>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    );
}