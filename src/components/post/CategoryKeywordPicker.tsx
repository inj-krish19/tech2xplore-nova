"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { apiFetch } from "@/lib/api-client";

// Real PK names per schema.prisma — categoryid/keywordid, not a shared "id".
type Category = { categoryid: string; name: string };
type Keyword = { keywordid: string; name: string };

/**
 * ASSUMED endpoints — adjust if your actual routes differ:
 *   GET /api/categories -> Category[]
 *   GET /api/keywords   -> Keyword[]
 *
 * Defensive against a non-array response (see FeedFilters.tsx for why —
 * BigInt PKs need to be stringified server-side before JSON.stringify,
 * or the route can end up returning an error body instead of an array).
 */
export function CategoryKeywordPicker({
    selectedCategoryIds,
    selectedKeywordIds,
    onChangeCategories,
    onChangeKeywords,
}: {
    selectedCategoryIds: string[];
    selectedKeywordIds: string[];
    onChangeCategories: (ids: string[]) => void;
    onChangeKeywords: (ids: string[]) => void;
}) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [keywords, setKeywords] = useState<Keyword[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        Promise.all([apiFetch<Category[]>("/api/categories"), apiFetch<Keyword[]>("/api/keywords")])
            .then(([cats, kws]) => {
                if (cancelled) return;
                if (!Array.isArray(cats) || !Array.isArray(kws)) {
                    setError("API returned an unexpected shape — check BigInt serialization on the route.");
                    setCategories(Array.isArray(cats) ? cats : []);
                    setKeywords(Array.isArray(kws) ? kws : []);
                    return;
                }
                setCategories(cats);
                setKeywords(kws);
            })
            .catch((err) => !cancelled && setError(err.message))
            .finally(() => !cancelled && setLoading(false));
        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return <div className="h-24 animate-pulse rounded-md border border-border bg-muted" />;
    }

    if (error) {
        return <p className="text-sm text-red-500">Couldn't load categories/keywords: {error}</p>;
    }

    return (
        <div className="flex flex-col gap-4">
            <TagPicker
                label="Categories"
                options={categories.map((c) => ({ id: c.categoryid, name: c.name }))}
                selectedIds={selectedCategoryIds}
                onChange={onChangeCategories}
            />
            <TagPicker
                label="Keywords"
                options={keywords.map((k) => ({ id: k.keywordid, name: k.name }))}
                selectedIds={selectedKeywordIds}
                onChange={onChangeKeywords}
            />
        </div>
    );
}

function TagPicker({
    label,
    options,
    selectedIds,
    onChange,
}: {
    label: string;
    options: { id: string; name: string }[];
    selectedIds: string[];
    onChange: (ids: string[]) => void;
}) {
    const toggle = (id: string) => {
        onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
    };

    const selected = options.filter((o) => selectedIds.includes(o.id));

    return (
        <div>
            <label className="text-sm font-medium">{label}</label>

            {selected.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {selected.map((tag) => (
                        <span
                            key={tag.id}
                            className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground"
                        >
                            {tag.name}
                            <button type="button" onClick={() => toggle(tag.id)} aria-label={`Remove ${tag.name}`}>
                                <FiX className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <div className="mt-2 flex flex-wrap gap-2">
                {options
                    .filter((o) => !selectedIds.includes(o.id))
                    .map((tag) => (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggle(tag.id)}
                            className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:border-accent hover:text-accent"
                        >
                            + {tag.name}
                        </button>
                    ))}
                {options.length === 0 && <p className="text-xs text-muted-foreground">None available yet.</p>}
            </div>
        </div>
    );
}