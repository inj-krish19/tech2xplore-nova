"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/posts", label: "Posts" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/categories", label: "Categories" },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <nav className="flex w-56 shrink-0 flex-col gap-1 border-r border-border p-4">
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
        </nav>
    );
}