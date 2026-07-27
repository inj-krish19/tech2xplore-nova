import Link from "next/link";
import {
    FiUsers,
    FiTrendingUp,
    FiGlobe,
    FiMessageCircle,
    FiCheckCircle,
    FiClock,
    FiShield,
    FiCode,
} from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/motion/Reveal";
import { WordsPullUp } from "@/components/motion/WordsPullUp";
import { AudienceSections } from "@/components/home/HeroToggle";
import { StatsSection } from "@/components/home/StatsSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { FaqSection } from "@/components/home/FaqSection";
import { LoggedInHome } from "@/components/home/LoggedInHome";
import { auth } from "@/lib/auth";

const SERVICES = [
    { icon: FiGlobe, title: "Website & software development", body: "End-to-end builds — from a marketing site to a full product — delivered against a set project timeline." },
    { icon: FiUsers, title: "Consulting & contract work", body: "Bring us into your project on a contract basis. We scope, timeline, and deliver like an extension of your own team." },
    { icon: FiTrendingUp, title: "Digital marketing", body: "Positioning, content strategy, and growth support for teams that need marketing done right, not just done." },
    { icon: FiMessageCircle, title: "Promotion on our platform", body: "Get your product or content in front of our readers. Reach out to the platform admin to discuss placement." },
];

const PLATFORM_POINTS = [
    { icon: FiUsers, title: "Write and publish", body: "Long-form technical posts with code blocks, media, and categories built for tech content — not repurposed from a generic blog template." },
    { icon: FiTrendingUp, title: "Follow and connect", body: "Follow other writers, build your following, and see who's reading and replying." },
    { icon: FiCode, title: "Get discovered", body: "Ranked by depth and relevance to what people actually follow, not engagement bait." },
];

const CLIENTS = [
    { name: "BuziHub", body: "Designed and built their public website plus an internal admin management platform for day-to-day operations." },
    { name: "ClinAware", body: "Built their internal healthcare software for monitoring blood pressure and diabetes, with automated patient reporting." },
    { name: "Rentac - Admin Ops", body: "Built a real-time shipment tracking dashboard and internal ops tooling for their dispatch team." },
];

const WHY_US = [
    { icon: FiClock, title: "Fixed timeline delivery", body: "We scope the project up front and deliver against the date we agreed on — not an open-ended engagement." },
    { icon: FiShield, title: "Built by people who ship", body: "The same team writing on this platform builds your project — not a subcontracted bench you've never met." },
    { icon: FiCheckCircle, title: "One team, start to finish", body: "Design, development, and delivery from a single accountable team, not handed off between vendors." },
];

const SAMPLE_POSTS = [
    { title: "Sharing Experience", description: "I have used multiple platforms but didn't find any with these many amazing features and integrations..." },
    { title: "Debugging a memory leak in a Node worker pool", description: "A walkthrough of tracking down a leak that only showed up under real production load." },
    { title: "What actually changed in the latest Postgres release", description: "Skipping the changelog fluff — the three changes worth your attention this cycle." },
];

export default async function HomePage() {
    const session = await auth();

    if (session?.user) {
        const username = (session.user as { username?: string }).username ?? null;
        return (
            <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">
                    <LoggedInHome username={username} />
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">
                <AudienceSections
                    hireContent={
                        <>
                            <StatsSection />
                            <ProcessSection />
                            <ServicesBlock />
                            <ClientsBlock />
                            <WhyUsBlock />
                            <PlatformBlock />
                            <SamplePostsBlock />
                            <FaqSection />
                            <LinkedInCta />
                            <FinalCta />
                        </>
                    }
                    writeContent={
                        <>
                            <StatsSection />
                            <PlatformBlock />
                            <SamplePostsBlock />
                            <ServicesBlock />
                            <ProcessSection />
                            <ClientsBlock />
                            <WhyUsBlock />
                            <FaqSection />
                            <LinkedInCta />
                            <FinalCta />
                        </>
                    }
                />
            </main>

            <Footer />
        </div>
    );
}

function LinkedInCta() {
    return (
        <section className="border-t border-border px-6 py-12">
            <Reveal className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 rounded-xl border border-border bg-muted px-8 py-8 sm:flex-row">
                <div className="flex items-center gap-4">
                    <FaLinkedin className="h-8 w-8 text-accent" />
                    <div>
                        <p className="font-display text-lg font-semibold">Follow Tech2Xplore on LinkedIn</p>
                        <p className="text-sm text-muted-foreground">Daily tech posts, platform updates, and behind-the-scenes from the team.</p>
                    </div>
                </div>
                <a
                    href="https://www.linkedin.com/company/tech2xplore/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90"
                >
                    Follow us
                </a>
            </Reveal>
        </section>
    );
}

function FinalCta() {
    return (
        <section id="contact" className="px-6 py-20 text-center">
            <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-4">
                <h2 className="font-display text-2xl font-semibold">
                    Have something worth writing — or building?
                </h2>
                <p className="text-sm text-muted-foreground">
                    Join as a writer, or reach out about a services engagement — either way, we'd like to hear from you.
                </p>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                    <Link href="/register" className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90">
                        Create your account
                    </Link>
                    <a href="mailto:tech2xplore@gmail.com" className="rounded-md border border-border px-6 py-3 text-sm font-medium hover:bg-muted">
                        Talk to us about a project
                    </a>
                </div>
            </Reveal>
        </section>
    );
}

function ServicesBlock() {
    return (
        <section id="services" className="border-t border-border px-6 py-20">
            <div className="mx-auto max-w-6xl">
                <Reveal>
                    <p className="font-mono-kicker text-muted-foreground">Beyond the platform</p>
                    <h2 className="mt-2 font-display text-3xl font-semibold">
                        <WordsPullUp text="Tech2Xplore is also a services & consulting company" />
                    </h2>
                </Reveal>
                <div className="mt-10 grid gap-6 sm:grid-cols-2">
                    {SERVICES.map((s, i) => (
                        <Reveal key={s.title} delay={i * 0.08} className="tilt-card rounded-xl border border-border bg-card p-6">
                            <s.icon className="h-6 w-6 text-accent" />
                            <h3 className="mt-3 font-display text-lg font-semibold">{s.title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

function PlatformBlock() {
    return (
        <section id="about" className="border-t border-border bg-muted px-6 py-20">
            <div className="mx-auto max-w-6xl">
                <Reveal>
                    <p className="font-mono-kicker text-muted-foreground">What Tech2Xplore is</p>
                    <h2 className="mt-2 font-display text-3xl font-semibold">
                        <WordsPullUp text="A blogging platform, built to be social" />
                    </h2>
                </Reveal>
                <div className="mt-10 grid gap-8 sm:grid-cols-3">
                    {PLATFORM_POINTS.map((p, i) => (
                        <Reveal key={p.title} delay={i * 0.1}>
                            <p.icon className="h-6 w-6 text-accent" />
                            <h3 className="mt-3 font-display text-lg font-semibold">{p.title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

function SamplePostsBlock() {
    return (
        <section className="border-t border-border px-6 py-20">
            <div className="mx-auto max-w-6xl">
                <Reveal>
                    <p className="font-mono-kicker text-muted-foreground">From the platform</p>
                    <h2 className="mt-2 font-display text-3xl font-semibold">
                        <WordsPullUp text="Recent posts from the community" />
                    </h2>
                </Reveal>
                <div className="mt-10 grid gap-6 sm:grid-cols-3">
                    {SAMPLE_POSTS.map((post, i) => (
                        <Reveal key={post.title} delay={i * 0.08} className="tilt-card relative rounded-xl border border-border bg-card p-6">
                            <p className="font-display text-lg font-semibold">{post.title}</p>
                            <p className="mt-2 text-sm text-muted-foreground">{post.description}</p>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ClientsBlock() {
    return (
        <section id="work" className="border-t border-border bg-muted px-6 py-20">
            <div className="mx-auto max-w-6xl">
                <Reveal>
                    <p className="font-mono-kicker text-muted-foreground">Client work</p>
                    <h2 className="mt-2 font-display text-3xl font-semibold">
                        <WordsPullUp text="Projects we've delivered" />
                    </h2>
                </Reveal>
                <div className="mt-10 grid gap-6 sm:grid-cols-3">
                    {CLIENTS.map((c, i) => (
                        <Reveal key={c.name} delay={i * 0.1} className="tilt-card rounded-xl border border-border bg-card p-6">
                            <p className="font-display text-lg font-semibold">{c.name}</p>
                            <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

function WhyUsBlock() {
    return (
        <section className="border-t border-border px-6 py-20">
            <div className="mx-auto max-w-6xl">
                <Reveal>
                    <p className="font-mono-kicker text-muted-foreground">Why teams choose us</p>
                    <h2 className="mt-2 font-display text-3xl font-semibold">
                        <WordsPullUp text="A team that delivers on the date it commits to" />
                    </h2>
                </Reveal>
                <div className="mt-10 grid gap-8 sm:grid-cols-3">
                    {WHY_US.map((p, i) => (
                        <Reveal key={p.title} delay={i * 0.1}>
                            <p.icon className="h-6 w-6 text-accent" />
                            <h3 className="mt-3 font-display text-lg font-semibold">{p.title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}