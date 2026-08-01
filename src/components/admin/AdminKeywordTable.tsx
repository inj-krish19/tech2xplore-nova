"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface AdminKeywordRow {
    keywordid: string;
    name: string;
    keyworddescription: string;
    postCount: number;
}

export function AdminKeywordTable({ keywords: initial }: { keywords: AdminKeywordRow[] }) {
    const router = useRouter();
    const [keywords, setKeywords] = useState(initial);

    // Parent re-renders with a fresh initial prop after router.refresh()
    // (pagination/search/status changes) — useState's initial value only
    // applies on mount, so without this the table keeps showing whatever
    // it first mounted with even though the URL and server data moved on.
    useEffect(() => {
        setKeywords(initial);
    }, [initial]);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const remove = async (id: string) => {
        if (!confirm("Delete this keyword permanently?")) return;
        setBusyId(id);
        setError(null);
        try {
            const res = await fetch(`/api/admin/keywords/${id}`, { method: "DELETE" });
            const body = await res.json();
            if (!res.ok) {
                setError(body.error ?? "Could not delete keyword");
                return;
            }
            setKeywords((prev) => prev.filter((k) => k.keywordid !== id));
            router.refresh();
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="space-y-3">
            {error && (
                <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-600">{error}</p>
            )}
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                        <th className="py-2">Name</th>
                        <th className="py-2">Description</th>
                        <th className="py-2">Posts</th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {keywords.map((k) => (
                        <tr key={k.keywordid} className="border-b border-border/50">
                            <td className="py-2 font-medium">{k.name}</td>
                            <td className="max-w-md truncate py-2 text-muted-foreground">{k.keyworddescription}</td>
                            <td className="py-2">{k.postCount}</td>
                            <td className="py-2">
                                <button
                                    disabled={busyId === k.keywordid}
                                    onClick={() => remove(k.keywordid)}
                                    className="text-xs text-red-600 hover:underline disabled:opacity-50"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {keywords.length === 0 && (
                        <tr>
                            <td colSpan={4} className="py-6 text-center text-muted-foreground">
                                No keywords found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}