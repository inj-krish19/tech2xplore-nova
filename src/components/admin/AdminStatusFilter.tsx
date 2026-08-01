"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const STATUSES = ["all", "draft", "published", "archived"] as const;

export function AdminStatusFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const current = searchParams.get("status") ?? "all";

    const onChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "all") {
            params.delete("status");
        } else {
            params.set("status", value);
        }
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <select
            value={current}
            onChange={(e) => onChange(e.target.value)}
            className="rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
        >
            {STATUSES.map((s) => (
                <option key={s} value={s}>
                    {s === "all" ? "All statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
            ))}
        </select>
    );
}