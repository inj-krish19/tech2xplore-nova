"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    FiEdit3,
    FiUsers,
    FiCompass,
    FiMenu,
    FiX,
    FiUser,
    FiLogOut,
    FiSettings,
} from "react-icons/fi";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

type NavUser = { name: string | null; username: string | null; image: string | null } | null;

const NAV_LINKS = [
    { href: "/feed", label: "Feed", icon: FiCompass },
    { href: "/communities", label: "Communities", icon: FiUsers },
];

export function HeaderNav({ user }: { user: NavUser }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            {/* Desktop */}
            <nav className="hidden items-center gap-1 md:flex">
                {NAV_LINKS.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${pathname === link.href
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                    >
                        <link.icon className="h-4 w-4" />
                        {link.label}
                    </Link>
                ))}
            </nav>

            <div className="hidden items-center gap-2 md:flex">
                <ThemeToggle />
                {user ? (
                    <>
                        <Link
                            href="/post/new"
                            className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
                        >
                            <FiEdit3 className="h-4 w-4" />
                            Write
                        </Link>
                        <ProfileMenu user={user} />
                    </>
                ) : (
                    <>
                        <Link href="/login" className="rounded-md px-4 py-2 text-sm font-medium hover:bg-muted">
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

            {/* Mobile trigger */}
            <div className="flex items-center gap-1 md:hidden">
                <ThemeToggle />
                <button
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open menu"
                    className="rounded-md p-2 text-foreground hover:bg-muted"
                >
                    <FiMenu className="h-5 w-5" />
                </button>
            </div>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setMobileOpen(false)}
                        aria-hidden
                    />
                    <div className="absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col gap-1 border-l border-border bg-background p-4">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="font-display text-base font-semibold">Menu</span>
                            <button
                                onClick={() => setMobileOpen(false)}
                                aria-label="Close menu"
                                className="rounded-md p-2 hover:bg-muted"
                            >
                                <FiX className="h-5 w-5" />
                            </button>
                        </div>

                        {user && (
                            <div className="mb-2 flex items-center gap-3 rounded-md border border-border p-3">
                                <Avatar image={user.image} name={user.name} className="h-9 w-9" />
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">{user.name ?? user.username}</p>
                                    {user.username && <p className="truncate text-xs text-muted-foreground">@{user.username}</p>}
                                </div>
                            </div>
                        )}

                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted"
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        ))}

                        {user ? (
                            <>
                                <Link
                                    href="/post/new"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted"
                                >
                                    <FiEdit3 className="h-4 w-4" />
                                    Write
                                </Link>
                                <Link
                                    href={`/profile/${user.username ?? ""}`}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted"
                                >
                                    <FiUser className="h-4 w-4" />
                                    Profile
                                </Link>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="mt-auto flex items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm font-medium text-red-500 hover:bg-muted"
                                >
                                    <FiLogOut className="h-4 w-4" />
                                    Log out
                                </button>
                            </>
                        ) : (
                            <div className="mt-2 flex flex-col gap-2">
                                <Link
                                    href="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-md border border-border px-3 py-2.5 text-center text-sm font-medium hover:bg-muted"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-md bg-accent px-3 py-2.5 text-center text-sm font-medium text-accent-foreground hover:opacity-90"
                                >
                                    Get started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

function ProfileMenu({ user }: { user: NonNullable<NavUser> }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                className="flex items-center gap-2 rounded-full border border-border p-1 pr-2 hover:bg-muted"
            >
                <Avatar image={user.image} name={user.name} className="h-7 w-7" />
                <span className="max-w-[100px] truncate text-sm font-medium">{user.name ?? user.username}</span>
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
                    <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-border bg-card p-1 shadow-lg">
                        <Link
                            href={`/profile/${user.username ?? ""}`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm hover:bg-muted"
                        >
                            <FiUser className="h-4 w-4" />
                            Profile
                        </Link>
                        <Link
                            href="/settings"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm hover:bg-muted"
                        >
                            <FiSettings className="h-4 w-4" />
                            Settings
                        </Link>
                        <button
                            onClick={() => {
                                setOpen(false);
                                signOut({ callbackUrl: "/" });
                            }}
                            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-red-500 hover:bg-muted"
                        >
                            <FiLogOut className="h-4 w-4" />
                            Log out
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

function Avatar({ image, name, className }: { image: string | null; name: string | null; className?: string }) {
    if (image) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={image} alt={name ?? "Profile"} className={`rounded-full object-cover ${className}`} />;
    }
    return (
        <div className={`flex items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground ${className}`}>
            {(name ?? "U").charAt(0).toUpperCase()}
        </div>
    );
}