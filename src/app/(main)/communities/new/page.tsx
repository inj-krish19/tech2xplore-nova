"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSend } from "react-icons/fi";
import { apiFetch } from "@/lib/api-client";
import { usePromiseToast } from "@/hooks/usePromiseToast";

/** ASSUMED: POST /api/communities body { name, communitydescription, communityicon? } -> { communityid } */
export default function NewCommunityPage() {
    const router = useRouter();
    const promiseToast = usePromiseToast();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const canSubmit = name.trim().length > 0 && description.trim().length > 0 && !submitting;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canSubmit) return;
        setSubmitting(true);
        try {
            const community = await promiseToast(
                apiFetch<{ communityid: string }>("/api/communities", {
                    method: "POST",
                    body: JSON.stringify({ name, communitydescription: description }),
                }),
                {
                    loading: "Creating community...",
                    success: "Community created",
                    error: (err) => (err instanceof Error ? err.message : "Couldn't create community"),
                }
            );
            router.push(`/communities/${community.communityid}`);
        } catch {
            // toast already shown
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
            <h1 className="font-display text-2xl font-semibold">Create a community</h1>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
                <div>
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. React Developers"
                        className="mt-2 w-full rounded-md border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-accent"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={5}
                        placeholder="What's this community about?"
                        className="mt-2 w-full resize-y rounded-md border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-accent"
                    />
                </div>

                <div className="flex justify-end border-t border-border pt-6">
                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
                    >
                        <FiSend className="h-4 w-4" />
                        {submitting ? "Creating..." : "Create community"}
                    </button>
                </div>
            </form>
        </div>
    );
}