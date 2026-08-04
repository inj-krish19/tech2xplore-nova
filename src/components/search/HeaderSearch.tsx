"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";

export function HeaderSearch({ className = "", onSubmit }: { className?: string; onSubmit?: () => void }) {
    const router = useRouter();
    const [value, setValue] = useState("");

    const submit = (e: SubmitEvent) => {
        e.preventDefault();
        const trimmed = value.trim();
        if (!trimmed) return;
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
        onSubmit?.();
    };

    return (
        <form onSubmit={submit} className={`relative ${className}`}>
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none focus:border-accent"
            />
        </form>
    );
}