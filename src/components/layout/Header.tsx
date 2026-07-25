"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { FiEdit3 } from "react-icons/fi";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/feed", label: "Explore" },
    { href: "/#services", label: "Services" },
    { href: "/#about", label: "About" },
];

export function Header() {
    const { data: session, status } = useSession();

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <Link href="/" className="font-display text-lg font-semibold tracking-tight">
                    Tech2Xplore
                </Link>

                <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
                    {NAV_LINKS.map((link) => (
                        <Link key={link.href} href={link.href} className="hover:text-foreground">
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    {status === "authenticated" && session?.user ? (
                        <>
                            <Link
                                href="/post/new"
                                className="hidden items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 sm:flex"
                            >
                                <FiEdit3 className="h-3.5 w-3.5" />
                                Write
                            </Link>
                            <Link
                                href={`/profile/${session.user.username}`}
                                className="text-sm font-medium hover:text-accent"
                            >
                                {session.user.name}
                            </Link>
                            <button
                                type="button"
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="text-sm text-muted-foreground hover:text-foreground"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium hover:text-accent">
                                Log in
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
                            >
                                Get started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}