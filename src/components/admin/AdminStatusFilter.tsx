"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const STATUSES = ["all", "draft", "published", "archived"] as const;

export function AdminStatusFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const current = searchParams.get("status") ?? "all";
    const [isPending, startTransition] = useTransition();

    const onChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "all") {
            params.delete("status");
        } else {
            params.set("status", value);
        }
        params.set("page", "1");
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
            // see AdminPagination.tsx — push alone can leave the router
            // cache serving the previous list until a hard reload.
            router.refresh();
        });
    };

    return (
        <select
            value={current}
            disabled={isPending}
            onChange={(e) => onChange(e.target.value)}
            className={`rounded-md border border-border bg-card px-3 py-2 text-sm outline-none transition-opacity focus:border-accent ${isPending ? "opacity-50" : ""
                }`}
        >
            {STATUSES.map((s) => (
                <option key={s} value={s}>
                    {s === "all" ? "All statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
            ))}
        </select>
    );
}