"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiSearch } from "react-icons/fi";

export function SearchBar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [value, setValue] = useState(searchParams.get("q") ?? "");
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const handle = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            const trimmed = value.trim();
            if (trimmed) {
                params.set("q", trimmed);
            } else {
                params.delete("q");
            }
            params.set("page", "1");
            startTransition(() => {
                router.push(`${pathname}?${params.toString()}`);
                // Same router-cache lesson learned on the admin controls —
                // push alone can leave the previous results showing.
                router.refresh();
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, 400);
        return () => clearTimeout(handle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <div className={`relative w-full max-w-md transition-opacity ${isPending ? "opacity-50" : ""}`}>
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search posts, people, or communities..."
                className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none focus:border-accent"
            />
        </div>
    );
}