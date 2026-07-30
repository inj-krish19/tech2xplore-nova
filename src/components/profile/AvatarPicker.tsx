"use client";

import { useState } from "react";
import { FiCheck } from "react-icons/fi";
import { apiFetch } from "@/lib/api-client";
import { useToast } from "@/components/ui/Toast";

/**
 * Presets come from lib/constants/avatar-presets.ts (a hardcoded file per
 * README §5), passed in as a prop from the server component — there's no
 * DB-backed /api/users/me/avatar-options endpoint, which is what the old
 * version of this file incorrectly assumed and crashed fetching.
 *
 * ASSUMED: POST /api/users/me/avatar body { avatarUrl } -> { avatarUrl }
 * still saves the selection — that part of the original assumption may
 * still be correct, only the options-source assumption was wrong.
 */
export function AvatarPicker({
    currentAvatarUrl,
    presets,
}: {
    currentAvatarUrl: string | null;
    presets: string[];
}) {
    const [selected, setSelected] = useState(currentAvatarUrl);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    const options = Array.isArray(presets) ? presets : [];

    async function save(url: string) {
        setSaving(true);
        const prev = selected;
        setSelected(url);
        try {
            await apiFetch("/api/users/me/avatar", { method: "PATCH", body: JSON.stringify({ url }) });
            toast({ message: "Avatar updated", variant: "success" });
        } catch (err) {
            setSelected(prev);
            toast({ message: err instanceof Error ? err.message : "Couldn't update avatar", variant: "error" });
        } finally {
            setSaving(false);
        }
    }

    if (options.length === 0) {
        return <p className="text-sm text-muted-foreground">No avatar presets available right now.</p>;
    }

    return (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
            {options.map((url) => (
                <button
                    key={url}
                    onClick={() => save(url)}
                    disabled={saving}
                    aria-label="Select avatar"
                    className={`relative aspect-square overflow-hidden rounded-full border-2 disabled:opacity-60 ${selected === url ? "border-accent" : "border-transparent hover:border-border"
                        }`}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    {selected === url && (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <FiCheck className="h-5 w-5 text-white" />
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}