"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiUsers } from "react-icons/fi";
import { apiFetch } from "@/lib/api-client";

type RelatedPost = { id: string; title: string; description: string };
type Collaborator = { username: string; name: string | null };

/** ASSUMED: GET /api/posts/[id]/related -> RelatedPost[] */
export function RelatedPosts({ postId }: { postId: string }) {
    const [posts, setPosts] = useState<RelatedPost[] | null>(null);

    useEffect(() => {
        apiFetch<RelatedPost[]>(`/api/posts/${postId}/related`)
            .then(setPosts)
            .catch(() => setPosts([]));
    }, [postId]);

    if (posts === null) {
        return <div className="h-40 animate-pulse rounded-xl border border-border bg-muted" />;
    }
    if (posts.length === 0) return null;

    return (
        <div>
            <h3 className="font-display text-base font-semibold">Related posts</h3>
            <div className="mt-3 flex flex-col gap-3">
                {posts.map((post) => (
                    <Link
                        key={post.id}
                        href={`/post/${post.id}`}
                        className="block rounded-md border border-border bg-card p-3 hover:border-accent"
                    >
                        <p className="text-sm font-medium">{post.title}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{post.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

/** ASSUMED: GET /api/posts/[id]/collaborators -> Collaborator[] (primary author excluded) */
export function CollaboratorList({ postId }: { postId: string }) {
    const [collaborators, setCollaborators] = useState<Collaborator[] | null>(null);

    useEffect(() => {
        apiFetch<Collaborator[]>(`/api/posts/${postId}/collaborators`)
            .then(setCollaborators)
            .catch(() => setCollaborators([]));
    }, [postId]);

    if (!collaborators || collaborators.length === 0) return null;

    return (
        <div>
            <div className="flex items-center gap-1.5">
                <FiUsers className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-display text-base font-semibold">Collaborators</h3>
            </div>
            <div className="mt-3 flex flex-col gap-2">
                {collaborators.map((c) => (
                    <Link
                        key={c.username}
                        href={`/profile/${c.username}`}
                        className="text-sm text-muted-foreground hover:text-accent"
                    >
                        {c.name ?? c.username}
                    </Link>
                ))}
            </div>
        </div>
    );
}