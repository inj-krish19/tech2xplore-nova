"use client";

import { useState } from "react";
import Link from "next/link";
import { FiUsers, FiUserPlus, FiX } from "react-icons/fi";
import { apiFetch } from "@/lib/api-client";
import { useToast } from "@/components/ui/Toast";

type Collaborator = {
    authorid: string;
    colloborationrole: "author" | "editor" | "contributor" | null;
    blogger: { authorid: string; name: string | null; username: string; profilepicture: string | null };
};

/**
 * ASSUMED endpoints (matching collaboration-service.ts's real functions):
 *   POST   /api/posts/[id]/collaborators body { username, role? } -> Collaborator  (addCollaborator)
 *   DELETE /api/posts/[id]/collaborators/[authorId]                                (removeCollaborator)
 *
 * Invite input + remove buttons only render when canManage is true — the
 * primary author, per the "primary only" side of the collaboration model
 * described in README §7 (post-service.ts's isPrimaryAuthor).
 */
export function CollaboratorPanel({
    postId,
    initialCollaborators,
    canManage,
}: {
    postId: string;
    initialCollaborators: Collaborator[];
    canManage: boolean;
}) {
    const [collaborators, setCollaborators] = useState(initialCollaborators);
    const [username, setUsername] = useState("");
    const [inviting, setInviting] = useState(false);
    const { toast } = useToast();

    async function invite() {
        if (!username.trim()) return;
        setInviting(true);
        try {
            const collaborator = await apiFetch<Collaborator>(`/api/posts/${postId}/collaborators`, {
                method: "POST",
                body: JSON.stringify({ username: username.trim() }),
            });
            setCollaborators((prev) => [...prev, collaborator]);
            setUsername("");
            toast({ message: `Added ${collaborator.blogger.name ?? collaborator.blogger.username}`, variant: "success" });
        } catch (err) {
            toast({ message: err instanceof Error ? err.message : "Couldn't add collaborator", variant: "error" });
        } finally {
            setInviting(false);
        }
    }

    async function remove(authorId: string) {
        const prev = collaborators;
        setCollaborators((c) => c.filter((x) => x.authorid !== authorId));
        try {
            await apiFetch(`/api/posts/${postId}/collaborators/${authorId}`, { method: "DELETE" });
        } catch (err) {
            setCollaborators(prev);
            toast({ message: err instanceof Error ? err.message : "Couldn't remove collaborator", variant: "error" });
        }
    }

    if (collaborators.length === 0 && !canManage) return null;

    return (
        <div>
            <div className="flex items-center gap-1.5">
                <FiUsers className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-display text-base font-semibold">Collaborators</h3>
            </div>

            {collaborators.length > 0 && (
                <div className="mt-3 flex flex-col gap-2">
                    {collaborators.map((c) => (
                        <div key={c.authorid} className="flex items-center justify-between gap-2">
                            <Link href={`/profile/${c.blogger.username}`} className="min-w-0 flex-1 text-sm text-muted-foreground hover:text-accent">
                                <span className="truncate">{c.blogger.name ?? c.blogger.username}</span>
                                {c.colloborationrole && <span className="ml-1.5 text-xs capitalize text-muted-foreground/70">({c.colloborationrole})</span>}
                            </Link>
                            {canManage && (
                                <button
                                    onClick={() => remove(c.authorid)}
                                    aria-label={`Remove ${c.blogger.username}`}
                                    className="shrink-0 text-muted-foreground hover:text-red-500"
                                >
                                    <FiX className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {canManage && (
                <div className="mt-3 flex gap-2">
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && invite()}
                        placeholder="Username to invite"
                        className="min-w-0 flex-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs outline-none focus:border-accent"
                    />
                    <button
                        onClick={invite}
                        disabled={inviting || !username.trim()}
                        aria-label="Invite collaborator"
                        className="shrink-0 rounded-md bg-accent px-2.5 py-1.5 text-accent-foreground disabled:opacity-50"
                    >
                        <FiUserPlus className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}
        </div>
    );
}