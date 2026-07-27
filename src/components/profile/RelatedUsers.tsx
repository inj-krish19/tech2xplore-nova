"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";

type RelatedUser = { username: string; name: string | null; image: string | null };

/**
 * If `preloaded` is passed (server-fetched via user-service.ts's
 * listRelatedUsers), render it directly — no client fetch needed. Falls
 * back to GET /api/users/[username]/related only when preloaded isn't
 * given, for any call site that still wants client-side fetching.
 */
export function RelatedUsers({ username, preloaded }: { username: string; preloaded?: RelatedUser[] }) {
    const [users, setUsers] = useState<RelatedUser[] | null>(preloaded ?? null);

    useEffect(() => {
        if (preloaded) return;
        apiFetch<RelatedUser[]>(`/api/users/${username}/related`)
            .then(setUsers)
            .catch(() => setUsers([]));
    }, [username, preloaded]);

    if (!users || users.length === 0) return null;

    return (
        <div>
            <h3 className="font-display text-base font-semibold">People you might follow</h3>
            <div className="mt-3 flex flex-col gap-3">
                {users.map((u) => (
                    <Link
                        key={u.username}
                        href={`/profile/${u.username}`}
                        className="flex items-center gap-3 rounded-md border border-border bg-card p-3 hover:border-accent"
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
                            {u.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={u.image} alt="" className="h-full w-full rounded-full object-cover" />
                            ) : (
                                (u.name ?? u.username).charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{u.name ?? u.username}</p>
                            <p className="truncate text-xs text-muted-foreground">@{u.username}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}