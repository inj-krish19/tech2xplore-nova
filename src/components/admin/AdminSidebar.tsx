"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const NAV_ITEMS = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/posts", label: "Posts" },
    { href: "/admin/orgposts", label: "Org Posts" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/categories", label: "Categories" },
    { href: "/admin/keywords", label: "Keywords" },
    { href: "/admin/communities", label: "Communities" },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        // sticky + h-screen + its own overflow-y-auto is what actually
        // pins this to the left while the <main> content scrolls — a
        // plain flex child with no sticky/height combo (the previous
        // version) just scrolls away with the page.
        <nav className="sticky top-0 flex h-screen w-56 shrink-0 flex-col gap-1 overflow-y-auto border-r border-border p-4">
            {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`rounded-md px-3 py-2 text-sm ${active ? "bg-muted font-medium" : "text-muted-foreground hover:bg-muted"
                            }`}
                    >
                        {item.label}
                    </Link>
                );
            })}

            <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs text-muted-foreground">Theme</span>
                <ThemeToggle />
            </div>
        </nav>
    );
}