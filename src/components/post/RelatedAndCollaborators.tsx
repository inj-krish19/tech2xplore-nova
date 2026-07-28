"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";

type RelatedPost = { id: string; title: string; description: string };

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