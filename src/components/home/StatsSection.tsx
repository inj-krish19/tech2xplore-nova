import { FiUsers, FiFolder, FiAward, FiTrendingUp } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";
import { Reveal } from "@/components/motion/Reveal";
import { WordsPullUp } from "@/components/motion/WordsPullUp";

/**
 * Client-facing trust numbers. Keep these accurate and update as they change —
 * this section exists specifically so a non-technical decision-maker can look
 * at it for five seconds and get "this is a real, active company," so every
 * number on it needs to survive a follow-up question.
 *
 * TODO: "reliability" card is a placeholder. Swap it for a real figure you can
 * stand behind — on-time delivery rate, client retention rate, an actual
 * average rating from client feedback — or drop the card. Don't ship an
 * unverifiable X/10 score.
 */
const COMPANY_STATS = [
    { icon: FiUsers, value: "10+", label: "Clients served" },
    { icon: FiFolder, value: "25+", label: "Projects delivered" },
    { icon: FiAward, value: "10+", label: "Team members across disciplines" },
    { icon: FiTrendingUp, value: "90%", label: "On-time delivery rate" }, // TODO: replace with real figure
];

const LINKEDIN_STATS = [
    { value: "60K+", label: "Impressions (YTD 2026)" },
    { value: "900+", label: "Reactions" },
    { value: "50+", label: "Comments" },
    { value: "350+", label: "Followers" },
];

export function StatsSection() {
    return (
        <section id="by-the-numbers" className="border-t border-border px-6 py-20">
            <div className="mx-auto max-w-6xl">
                <Reveal>
                    <p className="font-mono-kicker text-muted-foreground">By the numbers</p>
                    <h2 className="mt-2 font-display text-3xl font-semibold">
                        <WordsPullUp text="Traction you can check, not just claims" />
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                        We'd rather show you the numbers than tell you we're good.
                    </p>
                </Reveal>

                {/* Company / delivery stats */}
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {COMPANY_STATS.map((stat, i) => (
                        <Reveal
                            key={stat.label}
                            delay={i * 0.08}
                            className="tilt-card rounded-xl border border-border bg-card p-6 text-center"
                        >
                            <stat.icon className="mx-auto h-6 w-6 text-accent" />
                            <p className="mt-3 font-display text-3xl font-semibold">{stat.value}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                        </Reveal>
                    ))}
                </div>

                {/* LinkedIn growth strip */}
                <Reveal
                    delay={0.15}
                    className="mt-8 rounded-xl border border-border bg-muted p-6 sm:p-8"
                >
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <FaLinkedin className="h-6 w-6 text-accent" />
                            <div>
                                <p className="font-display text-base font-semibold">Growing on LinkedIn</p>
                                <p className="text-sm text-muted-foreground">Jan - Jul 2026</p>
                            </div>
                        </div>

                        {/* Headline growth %, with the real numbers right beside it so the
                claim is self-evidently backed, not just asserted */}
                        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-5 py-3">
                            <p className="font-display text-2xl font-semibold text-accent">+187.5%</p>
                            <p className="text-xs leading-tight text-muted-foreground">
                                follower growth
                                <br />
                                (46 new in last 30 days)
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {LINKEDIN_STATS.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="font-display text-xl font-semibold">{stat.value}</p>
                                <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}