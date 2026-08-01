"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface AdminCommunityRow {
    communityid: string;
    name: string;
    communitydescription: string;
    memberCount: number;
}

export function AdminCommunityTable({ communities: initial }: { communities: AdminCommunityRow[] }) {
    const router = useRouter();
    const [communities, setCommunities] = useState(initial);

    // Parent re-renders with a fresh initial prop after router.refresh()
    // (pagination/search/status changes) — useState's initial value only
    // applies on mount, so without this the table keeps showing whatever
    // it first mounted with even though the URL and server data moved on.
    useEffect(() => {
        setCommunities(initial);
    }, [initial]);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const remove = async (id: string) => {
        if (!confirm("Delete this community permanently?")) return;
        setBusyId(id);
        setError(null);
        try {
            const res = await fetch(`/api/admin/communities/${id}`, { method: "DELETE" });
            const body = await res.json();
            if (!res.ok) {
                // in_use case — a community can't be deleted while it still
                // has members (the creator always has at least one row), so
                // this is the expected/common path, not just an edge case.
                setError(body.error ?? "Could not delete community");
                return;
            }
            setCommunities((prev) => prev.filter((c) => c.communityid !== id));
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
                        <th className="py-2">Members</th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {communities.map((c) => (
                        <tr key={c.communityid} className="border-b border-border/50">
                            <td className="py-2 font-medium">{c.name}</td>
                            <td className="max-w-md truncate py-2 text-muted-foreground">{c.communitydescription}</td>
                            <td className="py-2">{c.memberCount}</td>
                            <td className="py-2">
                                <button
                                    disabled={busyId === c.communityid}
                                    onClick={() => remove(c.communityid)}
                                    className="text-xs text-red-600 hover:underline disabled:opacity-50"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {communities.length === 0 && (
                        <tr>
                            <td colSpan={4} className="py-6 text-center text-muted-foreground">
                                No communities found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}