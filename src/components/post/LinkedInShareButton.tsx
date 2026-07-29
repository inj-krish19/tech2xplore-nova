"use client";

import { useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import { apiFetch } from "@/lib/api-client";
import { useToast } from "@/components/ui/Toast";

/**
 * ASSUMED — no linkedin-service.ts was shared in this chat, so this whole
 * component is a guess at the shape of a feature that doesn't exist in
 * code yet, only in schema (blogger.linkedinurn/linkedinaccesstoken/
 * linkedintokenexpiresat). Real implementation needs:
 *   - token refresh when linkedintokenexpiresat has passed (not handled
 *     here — that has to live server-side in whatever calls LinkedIn's API)
 *   - the actual LinkedIn UGC Post API call, which needs linkedinurn as
 *     the author URN and a valid (non-expired) linkedinaccesstoken
 *
 * ASSUMED endpoint: POST /api/posts/[id]/linkedin-share -> { linkedinPostUrl }
 */
export function LinkedInShareButton({ postId }: { postId: string }) {
    const [sharing, setSharing] = useState(false);
    const [shared, setShared] = useState(false);
    const { toast } = useToast();

    async function share() {
        if (sharing || shared) return;
        setSharing(true);
        try {
            await apiFetch<{ linkedinPostUrl: string }>(`/api/posts/${postId}/linkedin-share`, { method: "POST" });
            setShared(true);
            toast({ message: "Posted to LinkedIn", variant: "success" });
        } catch (err) {
            toast({
                message: err instanceof Error ? err.message : "Couldn't post to LinkedIn",
                variant: "error",
            });
        } finally {
            setSharing(false);
        }
    }

    return (
        <button
            onClick={share}
            disabled={sharing || shared}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-accent disabled:opacity-60"
        >
            <FaLinkedin className="h-4 w-4" />
            {shared ? "Posted to LinkedIn" : sharing ? "Posting..." : "Post to LinkedIn"}
        </button>
    );
}