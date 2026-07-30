"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FiCornerDownRight, FiSend, FiTrash2 } from "react-icons/fi";
import { apiFetch } from "@/lib/api-client";
import { useToast } from "@/components/ui/Toast";

/** Matches comment-service.ts's CommentNode exactly — already a tree, no flattening needed. */
type CommentNode = {
    id: string;
    comment: string;
    createdAt: string;
    authorId: string;
    author: { username: string; name: string; profilepicture: string | null };
    replies: CommentNode[];
};

/**
 * ASSUMED endpoints (matching comment-service.ts's real functions):
 *   GET    /api/posts/[id]/comments -> CommentNode[]                (listCommentsForPost)
 *   POST   /api/posts/[id]/comments body {comment, parentcommentid?} -> comment row (createComment)
 *   DELETE /api/posts/[id]/comments/[commentId] -> {status: "deleted"|"has_replies"|"not_found"}
 *
 * "isOwn" isn't part of CommentNode — computed client-side by comparing
 * each node's authorId against the session's authorid, rather than
 * assuming the API adds a flag that isn't in the real service's return type.
 */
export function CommentSection({ postId }: { postId: string }) {
    const [comments, setComments] = useState<CommentNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [posting, setPosting] = useState(false);
    const { toast } = useToast();
    const { data: session } = useSession();
    const viewerAuthorId = (session?.user as { id?: string } | undefined)?.id;

    useEffect(() => {
        apiFetch<CommentNode[]>(`/api/posts/${postId}/comments`)
            .then((data) => setComments(Array.isArray(data) ? data : []))
            .catch((err) => toast({ message: err.message, variant: "error" }))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postId]);

    function countAll(nodes: CommentNode[]): number {
        if (!Array.isArray(nodes)) return 0;
        return nodes.reduce((sum, n) => sum + 1 + countAll(n.replies), 0);
    }

    async function postComment(text: string, parentcommentid: string | null) {
        if (!text.trim()) return;
        setPosting(true);
        try {
            await apiFetch(`/api/posts/${postId}/comments`, {
                method: "POST",
                body: JSON.stringify({ comment: text, parentcommentid }),
            });
            // Re-fetch rather than splice the new node into the tree by hand —
            // simpler and correct regardless of nesting depth.
            const fresh = await apiFetch<CommentNode[]>(`/api/posts/${postId}/comments`);
            setComments(Array.isArray(fresh) ? fresh : []);
            if (parentcommentid) {
                setReplyTo(null);
                setReplyText("");
            } else {
                setNewComment("");
            }
        } catch (err) {
            toast({ message: err instanceof Error ? err.message : "Couldn't post comment", variant: "error" });
        } finally {
            setPosting(false);
        }
    }

    async function deleteComment(id: string) {
        try {
            const result = await apiFetch<{ status: "deleted" | "has_replies" | "not_found" }>(
                `/api/posts/${postId}/comments/${id}`,
                { method: "DELETE" }
            );
            if (result.status === "has_replies") {
                toast({ message: "Can't delete a comment that has replies", variant: "error" });
                return;
            }
            const fresh = await apiFetch<CommentNode[]>(`/api/posts/${postId}/comments`);
            setComments(Array.isArray(fresh) ? fresh : []);
            toast({ message: "Comment deleted", variant: "success" });
        } catch (err) {
            toast({ message: err instanceof Error ? err.message : "Couldn't delete comment", variant: "error" });
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <h2 className="font-display text-lg font-semibold">Comments ({countAll(comments)})</h2>

            <div className="flex gap-2">
                <input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && postComment(newComment, null)}
                    placeholder="Add a comment..."
                    className="flex-1 rounded-md border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-accent"
                />
                <button
                    onClick={() => postComment(newComment, null)}
                    disabled={posting || !newComment.trim()}
                    className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
                >
                    <FiSend className="h-4 w-4" />
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col gap-3">
                    {[0, 1].map((i) => <div key={i} className="h-16 animate-pulse rounded-md border border-border bg-muted" />)}
                </div>
            ) : comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No comments yet — be the first to say something.</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {comments.map((node) => (
                        <CommentBranch
                            key={node.id}
                            node={node}
                            depth={0}
                            viewerAuthorId={viewerAuthorId}
                            replyTo={replyTo}
                            replyText={replyText}
                            posting={posting}
                            onReplyClick={setReplyTo}
                            onReplyTextChange={setReplyText}
                            onSubmitReply={(parentId) => postComment(replyText, parentId)}
                            onDelete={deleteComment}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function CommentBranch({
    node,
    depth,
    viewerAuthorId,
    replyTo,
    replyText,
    posting,
    onReplyClick,
    onReplyTextChange,
    onSubmitReply,
    onDelete,
}: {
    node: CommentNode;
    depth: number;
    viewerAuthorId: string | undefined;
    replyTo: string | null;
    replyText: string;
    posting: boolean;
    onReplyClick: (id: string) => void;
    onReplyTextChange: (text: string) => void;
    onSubmitReply: (parentId: string) => void;
    onDelete: (id: string) => void;
}) {
    const isOwn = viewerAuthorId !== undefined && node.authorId === viewerAuthorId;

    return (
        <div className={depth > 0 ? "ml-6 flex items-start gap-2" : "flex flex-col gap-2"}>
            {depth > 0 && <FiCornerDownRight className="mt-3 h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
            <div className="min-w-0 flex-1">
                <div className="rounded-md border border-border bg-card p-3">
                    <div className="flex items-center justify-between">
                        <Link
                            href={`/profile/${node.author.username}`}
                            className="flex items-center gap-2 text-sm font-medium hover:text-accent"
                        >
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-[10px] font-medium text-accent-foreground">
                                {node.author.profilepicture ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={node.author.profilepicture} alt="" className="h-full w-full object-cover" />
                                ) : (
                                    (node.author.name ?? node.author.username).charAt(0).toUpperCase()
                                )}
                            </div>
                            {node.author.name ?? node.author.username}
                        </Link>
                        <span className="text-xs text-muted-foreground">{new Date(node.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{node.comment}</p>
                    <div className="mt-2 flex items-center gap-3">
                        <button onClick={() => onReplyClick(node.id)} className="text-xs font-medium text-accent hover:opacity-80">
                            Reply
                        </button>
                        {isOwn && (
                            <button
                                onClick={() => onDelete(node.id)}
                                className="flex items-center gap-1 text-xs font-medium text-red-500 hover:opacity-80"
                            >
                                <FiTrash2 className="h-3 w-3" />
                                Delete
                            </button>
                        )}
                    </div>
                </div>

                {replyTo === node.id && (
                    <div className="mt-2 flex gap-2">
                        <input
                            autoFocus
                            value={replyText}
                            onChange={(e) => onReplyTextChange(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && onSubmitReply(node.id)}
                            placeholder="Reply..."
                            className="flex-1 rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
                        />
                        <button
                            onClick={() => onSubmitReply(node.id)}
                            disabled={posting || !replyText.trim()}
                            className="rounded-md bg-accent px-3 py-2 text-xs font-medium text-accent-foreground disabled:opacity-50"
                        >
                            Reply
                        </button>
                    </div>
                )}

                {node.replies.length > 0 && (
                    <div className="mt-2 flex flex-col gap-2">
                        {node.replies.map((reply) => (
                            <CommentBranch
                                key={reply.id}
                                node={reply}
                                depth={depth + 1}
                                viewerAuthorId={viewerAuthorId}
                                replyTo={replyTo}
                                replyText={replyText}
                                posting={posting}
                                onReplyClick={onReplyClick}
                                onReplyTextChange={onReplyTextChange}
                                onSubmitReply={onSubmitReply}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}