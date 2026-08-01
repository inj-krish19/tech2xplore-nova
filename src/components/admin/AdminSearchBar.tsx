"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiSearch } from "react-icons/fi";

export function AdminSearchBar({ placeholder = "Search..." }: { placeholder?: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [value, setValue] = useState(searchParams.get("search") ?? "");
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const handle = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set("search", value);
            } else {
                params.delete("search");
            }
            params.set("page", "1"); // a new search always starts back at page 1
            startTransition(() => {
                router.push(`${pathname}?${params.toString()}`);
                // see AdminPagination.tsx — push alone can leave the router
                // cache serving the previous list until a hard reload.
                router.refresh();
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, 400);
        return () => clearTimeout(handle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <div className={`relative w-full max-w-xs transition-opacity ${isPending ? "opacity-50" : ""}`}>
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none focus:border-accent"
            />
        </div>
    );
}