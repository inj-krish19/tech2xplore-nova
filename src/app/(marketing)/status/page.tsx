import { FiCheckCircle } from "react-icons/fi";
import { Reveal } from "@/components/motion/Reveal";
import { WordsPullUp } from "@/components/motion/WordsPullUp";

/**
 * PLACEHOLDER — this is a static page, not wired to any real uptime
 * monitoring or incident tracking yet (that's a FUTURE_WORK.md item:
 * "a public statement... makes the reliability claim verifiable
 * instead of just stated"). Every status below is asserted, not
 * measured. Swap for a real monitoring integration (or at minimum a
 * manually-updated incident log) before this claims anything the site
 * can't actually back up.
 */
const SERVICES = [
    { name: "Platform (web app)", status: "Operational" },
    { name: "API", status: "Operational" },
    { name: "LinkedIn automation", status: "Operational" },
    { name: "Email delivery", status: "Operational" },
];

export default function StatusPage() {
    return (
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-20">
            <Reveal>
                <p className="font-mono-kicker text-muted-foreground">Status</p>
                <h1 className="mt-2">
                    <WordsPullUp
                        text="System status"
                        className="font-display text-3xl font-semibold sm:text-4xl"
                    />
                </h1>
            </Reveal>

            <Reveal delay={0.1} className="mt-10 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-3 border-b border-border px-6 py-4">
                    <FiCheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-sm font-medium">All systems operational</p>
                </div>
                <ul className="divide-y divide-border">
                    {SERVICES.map((service) => (
                        <li key={service.name} className="flex items-center justify-between px-6 py-3.5">
                            <span className="text-sm">{service.name}</span>
                            <span className="flex items-center gap-1.5 text-xs text-green-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                                {service.status}
                            </span>
                        </li>
                    ))}
                </ul>
            </Reveal>

            <p className="mt-6 text-center text-xs text-muted-foreground">
                Status is currently updated manually, not from live monitoring.
            </p>
        </div>
    );
}