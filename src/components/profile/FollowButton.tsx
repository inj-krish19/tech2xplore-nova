"use client";

import { useState } from "react";
import { FiUserPlus, FiUserCheck } from "react-icons/fi";
import { apiFetch } from "@/lib/api-client";
import { useToast } from "@/components/ui/Toast";

/**
 * ASSUMED: POST /api/users/[username]/follow toggles follow state
 *   -> { following: boolean, followersCount: number }
 * Follow is instant/Instagram-style per README §7 — no request/approval step.
 */
export function FollowButton({
    username,
    initialFollowing,
    initialFollowersCount,
}: {
    username: string;
    initialFollowing: boolean;
    initialFollowersCount: number;
}) {
    const [following, setFollowing] = useState(initialFollowing);
    const [count, setCount] = useState(initialFollowersCount);
    const [pending, setPending] = useState(false);
    const { toast } = useToast();

    async function toggle() {
        if (pending) return;
        setPending(true);
        const prev = { following, count };
        setFollowing(!following);
        setCount(count + (following ? -1 : 1));

        try {
            const result = await apiFetch<{ following: boolean; followersCount: number }>(
                `/api/users/${username}/follow`,
                { method: "POST" }
            );
            setFollowing(result.following);
            setCount(result.followersCount);
        } catch (err) {
            setFollowing(prev.following);
            setCount(prev.count);
            toast({ message: err instanceof Error ? err.message : "Couldn't update follow status", variant: "error" });
        } finally {
            setPending(false);
        }
    }

    return (
        <button
            onClick={toggle}
            disabled={pending}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${following
                ? "border border-border text-foreground hover:border-red-500 hover:text-red-500"
                : "bg-accent text-accent-foreground hover:opacity-90"
                }`}
        >
            {following ? <FiUserCheck className="h-4 w-4" /> : <FiUserPlus className="h-4 w-4" />}
            {following ? "Following" : "Follow"}
        </button>
    );
}