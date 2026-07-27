"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { apiFetch } from "@/lib/api-client";

// Real PK names per schema.prisma — categoryid/keywordid, not a shared "id".
// Both PKs are BigInt server-side; expect them serialized to string over JSON.
type Category = { categoryid: string; name: string };
type Keyword = { keywordid: string; name: string };

/**
 * ASSUMED: GET /api/categories -> Category[], GET /api/keywords -> Keyword[]
 *
 * Defensive against a non-array response: category-service.ts's
 * listCategories()/listKeywords() return rows with a BigInt PK, and
 * JSON.stringify throws on BigInt unless the route converts it first —
 * if that conversion is missing, the route can end up returning an error
 * body instead of an array, which used to crash this component outright
 * on categories.map(). Now it degrades to an empty, still-usable filter
 * bar instead.
 */
export function FeedFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [categories, setCategories] = useState<Category[]>([]);
    const [keywords, setKeywords] = useState<Keyword[]>([]);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        apiFetch<Category[]>("/api/categories")
            .then((data) => {
                if (cancelled) return;
                setCategories(Array.isArray(data) ? data : []);
                if (!Array.isArray(data)) setLoadError(true);
            })
            .catch(() => !cancelled && setLoadError(true));

        apiFetch<Keyword[]>("/api/keywords")
            .then((data) => {
                if (cancelled) return;
                setKeywords(Array.isArray(data) ? data : []);
                if (!Array.isArray(data)) setLoadError(true);
            })
            .catch(() => !cancelled && setLoadError(true));

        return () => {
            cancelled = true;
        };
    }, []);

    function updateParam(key: string, value: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        params.delete("page"); // filter change resets pagination
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="flex flex-wrap items-center gap-3">
            <select
                value={searchParams.get("categoryId") ?? ""}
                onChange={(e) => updateParam("categoryId", e.target.value)}
                className="rounded-md border border-border bg-card px-3 py-2 text-sm"
            >
                <option value="">All categories</option>
                {categories.map((c) => (
                    <option key={c.categoryid} value={c.categoryid}>{c.name}</option>
                ))}
            </select>

            <select
                value={searchParams.get("keywordId") ?? ""}
                onChange={(e) => updateParam("keywordId", e.target.value)}
                className="rounded-md border border-border bg-card px-3 py-2 text-sm"
            >
                <option value="">All keywords</option>
                {keywords.map((k) => (
                    <option key={k.keywordid} value={k.keywordid}>{k.name}</option>
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

            {loadError && (
                <span className="text-xs text-muted-foreground">
                    Couldn't load filter options — check the API route's BigInt serialization.
                </span>
            )}
        </div>
    );
}