"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface AdminOrgPostRow {
    orgpostid: string;
    title: string | null;
    provider: string;
    linkedinurl: string | null;
    publishedat: string | null;
}

export function AdminOrgPostTable({ orgPosts: initial }: { orgPosts: AdminOrgPostRow[] }) {
    const router = useRouter();
    const [orgPosts, setOrgPosts] = useState(initial);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Parent re-renders with a fresh orgPosts prop after router.refresh()
    // (pagination/search changes or a retry run) — useState's initial
    // value only applies on mount, so without this the table would keep
    // showing whatever it first mounted with.
    useEffect(() => {
        setOrgPosts(initial);
    }, [initial]);

    const remove = async (id: string) => {
        if (!confirm("Delete this org post permanently?")) return;
        setBusyId(id);
        setError(null);
        try {
            const res = await fetch(`/api/admin/orgposts/${id}`, { method: "DELETE" });
            const body = await res.json();
            if (!res.ok) {
                setError(body.error ?? "Could not delete org post");
                return;
            }
            setOrgPosts((prev) => prev.filter((p) => p.orgpostid !== id));
            router.refresh();
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="space-y-3">
            {error && <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-600">{error}</p>}
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                        <th className="py-2">Title</th>
                        <th className="py-2">Provider</th>
                        <th className="py-2">Published</th>
                        <th className="py-2">LinkedIn</th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orgPosts.map((p) => (
                        <tr key={p.orgpostid} className="border-b border-border/50">
                            <td className="max-w-xs truncate py-2 font-medium">{p.title ?? "(untitled)"}</td>
                            <td className="py-2 capitalize text-muted-foreground">{p.provider}</td>
                            <td className="py-2 text-muted-foreground">
                                {p.publishedat ? new Date(p.publishedat).toLocaleDateString() : "—"}
                            </td>
                            <td className="py-2">
                                {p.linkedinurl ? (
                                    <a
                                        href={p.linkedinurl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-accent hover:underline"
                                    >
                                        View post
                                    </a>
                                ) : (
                                    <span className="text-xs text-muted-foreground">—</span>
                                )}
                            </td>
                            <td className="py-2">
                                <button
                                    disabled={busyId === p.orgpostid}
                                    onClick={() => remove(p.orgpostid)}
                                    className="text-xs text-red-600 hover:underline disabled:opacity-50"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {orgPosts.length === 0 && (
                        <tr>
                            <td colSpan={5} className="py-6 text-center text-muted-foreground">
                                No org posts yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}