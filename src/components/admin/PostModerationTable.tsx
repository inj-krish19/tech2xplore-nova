"use client";

import { useState } from "react";

export interface ModerationPost {
    id: string;
    title: string;
    authorUsername: string;
    status: "draft" | "published" | "archived";
    createdAt: string;
}

export function PostModerationTable({ posts: initialPosts }: { posts: ModerationPost[] }) {
    const [posts, setPosts] = useState(initialPosts);
    const [busyId, setBusyId] = useState<string | null>(null);

    const updateStatus = async (id: string, poststatus: ModerationPost["status"]) => {
        setBusyId(id);
        try {
            const res = await fetch(`/api/posts/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ poststatus }),
            });
            if (res.ok) {
                setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status: poststatus } : p)));
            }
        } finally {
            setBusyId(null);
        }
    };

    const removePost = async (id: string) => {
        if (!confirm("Delete this post permanently?")) return;
        setBusyId(id);
        try {
            const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
            if (res.ok) {
                setPosts((prev) => prev.filter((p) => p.id !== id));
            }
        } finally {
            setBusyId(null);
        }
    };

    return (
        <table className="w-full text-sm">
            <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-2">Title</th>
                    <th className="py-2">Author</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Created</th>
                    <th className="py-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {posts.map((post) => (
                    <tr key={post.id} className="border-b border-border/50">
                        <td className="py-2">{post.title}</td>
                        <td className="py-2 text-muted-foreground">@{post.authorUsername}</td>
                        <td className="py-2">
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{post.status}</span>
                        </td>
                        <td className="py-2 text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-2">
                            <div className="flex gap-2">
                                {post.status !== "published" && (
                                    <button
                                        disabled={busyId === post.id}
                                        onClick={() => updateStatus(post.id, "published")}
                                        className="text-xs text-green-600 hover:underline disabled:opacity-50"
                                    >
                                        Approve
                                    </button>
                                )}
                                {post.status !== "archived" && (
                                    <button
                                        disabled={busyId === post.id}
                                        onClick={() => updateStatus(post.id, "archived")}
                                        className="text-xs text-amber-600 hover:underline disabled:opacity-50"
                                    >
                                        Archive
                                    </button>
                                )}
                                <button
                                    disabled={busyId === post.id}
                                    onClick={() => removePost(post.id)}
                                    className="text-xs text-red-600 hover:underline disabled:opacity-50"
                                >
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}