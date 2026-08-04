import Link from "next/link";
import { FaLinkedin, FaGithub } from "react-icons/fa";

/**
 * Navigation strategy, for future reference: the navbar stays fixed at
 * its current handful of links (Feed/Discover/Communities/Company posts
 * + Write + profile menu) — it already overflowed once (see HeaderSearch,
 * which got moved OUT of the nav and onto the feed page for that exact
 * reason). Every marketing/legal page added from here on goes in a
 * footer column instead, never the navbar. Footer columns can grow
 * indefinitely (a few more `links` entries costs nothing visually); the
 * navbar cannot. If this list keeps growing past ~6-7 items per column,
 * the next step is collapsing each column into an <details> accordion on
 * mobile — not adding a 5th/6th column.
 */
const COLUMNS = [
    {
        heading: "Platform",
        links: [
            { href: "/feed", label: "Feed" },
            { href: "/communities", label: "Communities" },
            { href: "/discover", label: "Discover" },
            { href: "/post/new", label: "Write a post" },
        ],
    },
    {
        heading: "Company",
        links: [
            { href: "/services", label: "Services" },
            { href: "/case-studies", label: "Case studies" },
            { href: "/pricing", label: "Pricing" },
            { href: "/process", label: "How we work" },
            { href: "/team", label: "Meet the team" },
            { href: "/careers", label: "Careers" },
        ],
    },
    {
        heading: "Resources",
        links: [
            { href: "/testimonials", label: "Testimonials" },
            { href: "/faq", label: "FAQ" },
            { href: "/contact", label: "Get a quote" },
            { href: "/status", label: "Status" },
        ],
    },
    {
        heading: "Legal",
        links: [
            { href: "/privacy", label: "Privacy policy" },
            { href: "/terms", label: "Terms of service" },
        ],
    },
];

export function Footer() {
    return (
        <footer className="border-t border-border px-4 py-12 sm:px-6">
            <div className="mx-auto max-w-6xl">
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5">
                    {/* Brand — spans full width on mobile so it doesn't fight for a column */}
                    <div className="col-span-2 sm:col-span-3 md:col-span-1">
                        <p className="font-display text-lg font-semibold">Tech2Xplore</p>
                        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                            A blogging platform for developers — and the services team behind it.
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                            <a
                                href="https://www.linkedin.com/company/tech2xplore/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Tech2Xplore on LinkedIn"
                                className="rounded-md border border-border p-2 text-muted-foreground hover:text-accent"
                            >
                                <FaLinkedin className="h-4 w-4" />
                            </a>
                            <a
                                href="https://github.com/inj-krish19/Tech2Xplore"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Tech2Xplore on GitHub"
                                className="rounded-md border border-border p-2 text-muted-foreground hover:text-accent"
                            >
                                <FaGithub className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {COLUMNS.map((col) => (
                        <div key={col.heading}>
                            <p className="font-mono-kicker text-muted-foreground">{col.heading}</p>
                            <ul className="mt-3 flex flex-col gap-2">
                                {col.links.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <p>&copy; {new Date().getFullYear()} Tech2Xplore. All rights reserved.</p>
                    <a href="mailto:tech2xplore@gmail.com" className="hover:text-foreground">
                        tech2xplore@gmail.com
                    </a>
                </div>
            </div>
        </footer>
    );
}