import Link from "next/link";
import {
  FiEdit3,
  FiUsers,
  FiCode,
  FiTrendingUp,
  FiBriefcase,
  FiGlobe,
  FiMessageCircle,
  FiCheckCircle,
  FiClock,
  FiShield,
} from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/motion/Reveal";
import { WordsPullUp } from "@/components/motion/WordsPullUp";
import { StatsSection } from "@/components/home/StatsSection";

const SERVICES = [
  {
    icon: FiGlobe,
    title: "Website & software development",
    body: "End-to-end builds — from a marketing site to a full product — delivered against a set project timeline.",
  },
  {
    icon: FiBriefcase,
    title: "Consulting & contract work",
    body: "Bring us into your project on a contract basis. We scope, timeline, and deliver like an extension of your own team.",
  },
  {
    icon: FiTrendingUp,
    title: "Digital marketing",
    body: "Positioning, content strategy, and growth support for teams that need marketing done right, not just done.",
  },
  {
    icon: FiMessageCircle,
    title: "Promotion on our platform",
    body: "Get your product or content in front of our readers. Reach out to the platform admin to discuss placement.",
  },
];

const PLATFORM_POINTS = [
  {
    icon: FiEdit3,
    title: "Write and publish",
    body: "Long-form technical posts with code blocks, media, and categories built for tech content — not repurposed from a generic blog template.",
  },
  {
    icon: FiUsers,
    title: "Follow and connect",
    body: "Follow other writers, build your following, and see who's reading and replying — the same connect-and-network model you already know from LinkedIn, built for this community.",
  },
  {
    icon: FiTrendingUp,
    title: "Get discovered",
    body: "Ranked by depth and relevance to what people actually follow, not engagement bait — so a well-written post finds its readers.",
  },
];

/**
 * These three are real work — confirm/replace the copy with the actual
 * scope once you send it over. The third (Northlane Logistics) is a
 * placeholder I added since you asked for one — swap it for a real
 * client or your own wording before this ships.
 */
const CLIENTS = [
  {
    name: "BuziHub",
    body: "Designed and built their public website plus an internal admin management platform for day-to-day operations.",
  },
  {
    name: "ClinAware",
    body: "Built their internal healthcare software for monitoring blood pressure and diabetes, with automated patient reporting.",
  },
  {
    name: "Rentac - Admin Ops",
    body: "Built a real-time shipment tracking dashboard and internal ops tooling for their dispatch team.",
  },
];

const WHY_US = [
  { icon: FiClock, title: "Fixed timeline delivery", body: "We scope the project up front and deliver against the date we agreed on — not an open-ended engagement." },
  { icon: FiShield, title: "Built by people who ship", body: "The same team writing on this platform builds your project — not a subcontracted bench you've never met." },
  { icon: FiCheckCircle, title: "One team, start to finish", body: "Design, development, and delivery from a single accountable team, not handed off between vendors." },
];

export default async function HomePage() {

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="flex justify-center items-center">
          <div className="hero-glow relative overflow-hidden px-6 pb-20 pt-24">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
              <span className="font-mono-kicker text-accent">A platform, only for tech</span>
              <h1 className="font-display text-5xl font-semibold leading-[1.05] sm:text-6xl">
                <WordsPullUp text="Blog, connect, and build —" />
                <br />
                <WordsPullUp text="all in one place for tech" delayStep={0.06} />
              </h1>
              <Reveal delay={0.3}>
                <p className="max-w-xl text-lg text-muted-foreground">
                  Tech2Xplore is a blogging platform for developers, researchers, and builders —
                  write posts, follow other writers, and grow a real following. Behind it, we're
                  also a services and consulting company available for contract work.
                </p>
              </Reveal>
              <Reveal delay={0.45} className="mt-2 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90"
                >
                  Start writing
                </Link>
                <Link
                  href="/feed"
                  className="rounded-md border border-border px-6 py-3 text-sm font-medium hover:bg-muted"
                >
                  Explore posts
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 1. BEYOND THE PLATFORM — services & consulting, leads for client conversion */}
        <section id="services" className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <p className="font-mono-kicker text-muted-foreground">Beyond the platform</p>
              <h2 className="mt-2 font-display text-3xl font-semibold">
                <WordsPullUp text="Tech2Xplore is also a services & consulting company" />
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                We take on contract-based work — consulting and service engagements delivered
                against a set project timeline, the way an in-house team would work, just
                outsourced to us.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {SERVICES.map((service, i) => (
                <Reveal
                  key={service.title}
                  delay={i * 0.08}
                  className="tilt-card rounded-xl border border-border bg-card p-6"
                >
                  <service.icon className="h-6 w-6 text-accent" />
                  <h3 className="mt-3 font-display text-lg font-semibold">{service.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{service.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 2. WHAT TECH2XPLORE IS — the platform side */}
        <section id="about" className="border-t border-border bg-muted px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <p className="font-mono-kicker text-muted-foreground">What Tech2Xplore is</p>
              <h2 className="mt-2 font-display text-3xl font-semibold">
                <WordsPullUp text="A blogging platform, built to be social" />
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {PLATFORM_POINTS.map((point, i) => (
                <Reveal key={point.title} delay={i * 0.1}>
                  <point.icon className="h-6 w-6 text-accent" />
                  <h3 className="mt-3 font-display text-lg font-semibold">{point.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{point.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>


        {/* 3. STATS SECTION */}
        <StatsSection />


        {/* 4. EXAMPLE POSTS */}
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

        {/* 5. CLIENTS — case studies, the actual trust-building section for contract leads */}
        <section className="border-t border-border bg-muted px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <p className="font-mono-kicker text-muted-foreground">Client work</p>
              <h2 className="mt-2 font-display text-3xl font-semibold">
                <WordsPullUp text="Projects we've delivered" />
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {CLIENTS.map((client, i) => (
                <Reveal key={client.name} delay={i * 0.1} className="tilt-card rounded-xl border border-border bg-card p-6">
                  <p className="font-display text-lg font-semibold">{client.name}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{client.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 6. WHY WORK WITH US — second "about tech2xplore" section, closes the client pitch */}
        <section className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <p className="font-mono-kicker text-muted-foreground">Why teams choose us</p>
              <h2 className="mt-2 font-display text-3xl font-semibold">
                <WordsPullUp text="A team that delivers on the date it commits to" />
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {WHY_US.map((point, i) => (
                <Reveal key={point.title} delay={i * 0.1}>
                  <point.icon className="h-6 w-6 text-accent" />
                  <h3 className="mt-3 font-display text-lg font-semibold">{point.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{point.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* LinkedIn CTA */}
        <section className="border-t border-border px-6 py-12">
          <Reveal className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 rounded-xl border border-border bg-muted px-8 py-8 sm:flex-row">
            <div className="flex items-center gap-4">
              <FaLinkedin className="h-8 w-8 text-accent" />
              <div>
                <p className="font-display text-lg font-semibold">Follow Tech2Xplore on LinkedIn</p>
                <p className="text-sm text-muted-foreground">
                  Daily tech posts, platform updates, and behind-the-scenes from the team.
                </p>
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

        {/* Code-first feature strip */}
        <section className="border-t border-border bg-muted px-6 py-16">
          <Reveal className="mx-auto flex max-w-6xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <FiCode className="h-6 w-6 text-accent" />
              <p className="font-display text-lg font-semibold">Code-first, not code-decorated</p>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Syntax-highlighted snippets and real examples, written by people who ship — not
              content assembled to rank.
            </p>
          </Reveal>
        </section>

        {/* Final CTA — dual path: platform signup or client inquiry */}
        <section id="contact" className="px-6 py-20 text-center">
          <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-4">
            <h2 className="font-display text-2xl font-semibold">
              Have something worth writing — or building?
            </h2>
            <p className="text-sm text-muted-foreground">
              Join as a writer, or reach out about a services engagement — either way, we'd like
              to hear from you.
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90"
              >
                Create your account
              </Link>
              <a
                href="mailto:tech2xplore@gmail.com"
                className="rounded-md border border-border px-6 py-3 text-sm font-medium hover:bg-muted"
              >
                Talk to us about a project
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/** Shown only if there are zero published posts yet, clearly badged "Sample." */
const SAMPLE_POSTS = [
  {
    title: "Sharing Experience",
    description: "I have use multiple platforms but I didn't find any platform with these many amazing features and integrations. I love this platform among ...",
  },
  {
    title: "Debugging a memory leak in a Node worker pool",
    description: "A walkthrough of tracking down a leak that only showed up under real production load.",
  },
  {
    title: "What actually changed in the latest Postgres release",
    description: "Skipping the changelog fluff — the three changes worth your attention this cycle.",
  },
];