"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { apiFetch } from "@/lib/api-client";

type Tag = { id: string; name: string };

/** ASSUMED: GET /api/categories, GET /api/keywords -> Tag[] (same as post creation) */
export function FeedFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [categories, setCategories] = useState<Tag[]>([]);
    const [keywords, setKeywords] = useState<Tag[]>([]);

    useEffect(() => {
        Promise.all([apiFetch<Tag[]>("/api/categories"), apiFetch<Tag[]>("/api/keywords")])
            .then(([cats, kws]) => {
                setCategories(cats);
                setKeywords(kws);
            })
            .catch(() => {
                setCategories([]);
                setKeywords([]);
            });
    }, []);

    function updateParam(key: string, value: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        params.delete("page"); // filter change resets pagination
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="flex flex-wrap gap-3">
            <select
                value={searchParams.get("categoryId") ?? ""}
                onChange={(e) => updateParam("categoryId", e.target.value)}
                className="rounded-md border border-border bg-card px-3 py-2 text-sm"
            >
                <option value="">All categories</option>
                {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>

            <select
                value={searchParams.get("keywordId") ?? ""}
                onChange={(e) => updateParam("keywordId", e.target.value)}
                className="rounded-md border border-border bg-card px-3 py-2 text-sm"
            >
                <option value="">All keywords</option>
                {keywords.map((k) => (
                    <option key={k.id} value={k.id}>{k.name}</option>
                ))}
            </select>

            {(searchParams.get("categoryId") || searchParams.get("keywordId")) && (
                <button
                    onClick={() => router.push(pathname)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-accent hover:opacity-80"
                >
                    Clear filters
                </button>
            )}
        </div>
    );
}