"use client";

import { useState } from "react";

export interface CommentNode {
    id: string;
    comment: string;
    createdAt: string;
    author: { username: string; name: string; profilepicture?: string | null };
    replies: CommentNode[];
}

export function CommentThread({
    comments,
    onReply,
}: {
    comments: CommentNode[];
    onReply?: (parentId: string, text: string) => Promise<void>;
}) {
    return (
        <div className="flex flex-col gap-4">
            {comments.map((c) => (
                <CommentItem key={c.id} node={c} onReply={onReply} depth={0} />
            ))}
        </div>
    );
}

function CommentItem({
    node,
    onReply,
    depth,
}: {
    node: CommentNode;
    onReply?: (parentId: string, text: string) => Promise<void>;
    depth: number;
}) {
    const [replying, setReplying] = useState(false);
    const [text, setText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const submitReply = async () => {
        if (!text.trim() || !onReply) return;
        setSubmitting(true);
        try {
            await onReply(node.id, text.trim());
            setText("");
            setReplying(false);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ marginLeft: depth > 0 ? 24 : 0 }} className="border-l border-border pl-3">
            <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium">{node.author.name}</span>
                <span className="text-xs text-muted-foreground">@{node.author.username}</span>
            </div>
            <p className="mt-1 text-sm">{node.comment}</p>

            {onReply && (
                <button
                    type="button"
                    onClick={() => setReplying((v) => !v)}
                    className="mt-1 text-xs text-muted-foreground hover:text-foreground"
                >
                    Reply
                </button>
            )}

            {replying && (
                <div className="mt-2 flex gap-2">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Write a reply…"
                        className="flex-1 rounded-md border border-border px-2 py-1 text-sm"
                        maxLength={750}
                    />
                    <button
                        type="button"
                        onClick={submitReply}
                        disabled={submitting || !text.trim()}
                        className="rounded-md bg-foreground px-3 py-1 text-xs text-background disabled:opacity-50"
                    >
                        Post
                    </button>
                </div>
            )}

            {node.replies.length > 0 && (
                <div className="mt-3 flex flex-col gap-3">
                    {node.replies.map((reply) => (
                        <CommentItem key={reply.id} node={reply} onReply={onReply} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}