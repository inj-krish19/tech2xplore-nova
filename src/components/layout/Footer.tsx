import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";

const COLUMNS = [
    {
        title: "Platform",
        links: [
            { label: "Explore posts", href: "/feed" },
            { label: "Write a post", href: "/post/new" },
            { label: "Categories", href: "/feed" },
        ],
    },
    {
        title: "Services",
        links: [
            { label: "Consulting & contract work", href: "/#services" },
            { label: "Digital marketing", href: "/#services" },
            { label: "Website & software development", href: "/#services" },
            { label: "Promote on our platform", href: "/#contact" },
        ],
    },
    {
        title: "Account",
        links: [
            { label: "Log in", href: "/login" },
            { label: "Create account", href: "/register" },
        ],
    },
];

export function Footer() {
    return (
        <footer className="border-t border-border">
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
                <div>
                    <span className="font-display text-lg font-semibold">Tech2Xplore</span>
                    <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                        A blogging platform for developers and builders — and the services & consulting arm
                        behind it, available for contract-based work.
                    </p>
                    <a
                        href="https://www.linkedin.com/company/tech2xplore/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent"
                    >
                        <FaLinkedin className="h-4 w-4" />
                        Follow us on LinkedIn
                    </a>
                </div>

                {COLUMNS.map((col) => (
                    <div key={col.title}>
                        <p className="font-mono-kicker text-muted-foreground">{col.title}</p>
                        <ul className="mt-3 flex flex-col gap-2">
                            {col.links.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="border-t border-border px-6 py-6">
                <p className="mx-auto max-w-6xl text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Tech2Xplore. Built for the tech-obsessed.
                </p>
            </div>
        </footer>
    );
}