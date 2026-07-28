"use client";

import { useState } from "react";
import { FiUserPlus, FiUserMinus } from "react-icons/fi";
import { apiFetch } from "@/lib/api-client";
import { useToast } from "@/components/ui/Toast";

/**
 * ASSUMED endpoints (matching community-service.ts's joinCommunity/leaveCommunity,
 * both of which are already safe no-ops if called redundantly):
 *   POST   /api/communities/[id]/membership -> { joined: true, memberCount }
 *   DELETE /api/communities/[id]/membership -> { joined: false, memberCount }
 */
export function CommunityJoinButton({
    communityId,
    initialIsMember,
    initialMemberCount,
}: {
    communityId: string;
    initialIsMember: boolean;
    initialMemberCount: number;
}) {
    const [isMember, setIsMember] = useState(initialIsMember);
    const [memberCount, setMemberCount] = useState(initialMemberCount);
    const [pending, setPending] = useState(false);
    const { toast } = useToast();

    async function toggle() {
        if (pending) return;
        setPending(true);
        const prev = { isMember, memberCount };
        setIsMember(!isMember);
        setMemberCount(memberCount + (isMember ? -1 : 1));

        try {
            const result = await apiFetch<{ joined: boolean; memberCount: number }>(
                `/api/communities/${communityId}/membership`,
                { method: isMember ? "DELETE" : "POST" }
            );
            setIsMember(result.joined);
            setMemberCount(result.memberCount);
        } catch (err) {
            setIsMember(prev.isMember);
            setMemberCount(prev.memberCount);
            toast({ message: err instanceof Error ? err.message : "Couldn't update membership", variant: "error" });
        } finally {
            setPending(false);
        }
    }

    return (
        <button
            onClick={toggle}
            disabled={pending}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${isMember
                ? "border border-border text-foreground hover:border-red-500 hover:text-red-500"
                : "bg-accent text-accent-foreground hover:opacity-90"
                }`}
        >
            {isMember ? <FiUserMinus className="h-4 w-4" /> : <FiUserPlus className="h-4 w-4" />}
            {isMember ? "Leave" : "Join"} &middot; {memberCount}
        </button>
    );
}