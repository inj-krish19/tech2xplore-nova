"use client";

import { useState } from "react";
import { FiThumbsUp, FiThumbsDown, FiShare2 } from "react-icons/fi";
import { apiFetch } from "@/lib/api-client";
import { useToast } from "@/components/ui/Toast";

type ReactionType = "like" | "dislike";

/**
 * ASSUMED endpoints (matching reaction-service.ts's two real functions,
 * plus the new share-service.ts):
 *   POST   /api/posts/[id]/react   body { type: "like" | "dislike" } -> { likes, dislikes }  (reactToPost)
 *   DELETE /api/posts/[id]/react                                     -> { likes, dislikes }  (removeReaction)
 *   POST   /api/posts/[id]/share   -> { url, shares }  (recordShare)
 *
 * reactToPost is a no-op when you send the same type you already have —
 * it does NOT clear the reaction — so clearing an active reaction has to
 * go through the separate DELETE (removeReaction), not a second POST.
 */
export function PostEngagement({
    postId,
    initialLikes,
    initialDislikes,
    initialUserReaction,
    initialShares,
}: {
    postId: string;
    initialLikes: number;
    initialDislikes: number;
    initialUserReaction: ReactionType | null;
    initialShares: number;
}) {
    const [likes, setLikes] = useState(initialLikes);
    const [dislikes, setDislikes] = useState(initialDislikes);
    const [userReaction, setUserReaction] = useState<ReactionType | null>(initialUserReaction);
    const [shares, setShares] = useState(initialShares);
    const [reacting, setReacting] = useState(false);
    const { toast } = useToast();

    async function react(type: ReactionType) {
        if (reacting) return;
        setReacting(true);

        const clearing = userReaction === type;
        const prev = { likes, dislikes, userReaction };

        // Optimistic update
        if (clearing) {
            setUserReaction(null);
            setLikes(likes - (type === "like" ? 1 : 0));
            setDislikes(dislikes - (type === "dislike" ? 1 : 0));
        } else {
            setUserReaction(type);
            setLikes(likes + (type === "like" ? 1 : userReaction === "like" ? -1 : 0));
            setDislikes(dislikes + (type === "dislike" ? 1 : userReaction === "dislike" ? -1 : 0));
        }

        try {
            const result = clearing
                ? await apiFetch<{ likes: number; dislikes: number }>(`/api/posts/${postId}/react`, { method: "DELETE" })
                : await apiFetch<{ likes: number; dislikes: number }>(`/api/posts/${postId}/react`, {
                    method: "POST",
                    body: JSON.stringify({ type }),
                });
            setLikes(result.likes);
            setDislikes(result.dislikes);
            setUserReaction(clearing ? null : type);
        } catch (err) {
            setLikes(prev.likes);
            setDislikes(prev.dislikes);
            setUserReaction(prev.userReaction);
            toast({ message: err instanceof Error ? err.message : "Couldn't react, try again", variant: "error" });
        } finally {
            setReacting(false);
        }
    }

    async function share() {
        try {
            const result = await apiFetch<{ url: string; shares: number }>(`/api/posts/${postId}/share`, { method: "POST" });
            await navigator.clipboard.writeText(result.url);
            setShares(result.shares);
            toast({ message: "Link copied to clipboard", variant: "success" });
        } catch (err) {
            toast({ message: err instanceof Error ? err.message : "Couldn't get share link", variant: "error" });
        }
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => react("like")}
                aria-pressed={userReaction === "like"}
                className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${userReaction === "like"
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:text-foreground"
                    }`}
            >
                <FiThumbsUp className="h-4 w-4" />
                {likes}
            </button>
            <button
                onClick={() => react("dislike")}
                aria-pressed={userReaction === "dislike"}
                className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${userReaction === "dislike"
                    ? "border-red-500 bg-red-500/10 text-red-500"
                    : "border-border text-muted-foreground hover:text-foreground"
                    }`}
            >
                <FiThumbsDown className="h-4 w-4" />
                {dislikes}
            </button>
            <button
                onClick={share}
                className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
                <FiShare2 className="h-4 w-4" />
                Share{shares > 0 ? ` (${shares})` : ""}
            </button>
        </div>
    );
}