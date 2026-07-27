"use client";

import { useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";
import { apiFetch } from "@/lib/api-client";
import { useToast } from "@/components/ui/Toast";

/**
 * ASSUMED endpoints (both already listed as existing in README §5):
 *   GET  /api/users/me/avatar-options -> string[] (preset URLs)
 *   POST /api/users/me/avatar body { avatarUrl } -> { avatarUrl }
 */
export function AvatarPicker({ currentAvatarUrl }: { currentAvatarUrl: string | null }) {
    const [options, setOptions] = useState<string[] | null>(null);
    const [selected, setSelected] = useState(currentAvatarUrl);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        apiFetch<string[]>("/api/users/me/avatar-options")
            .then(setOptions)
            .catch(() => setOptions([]));
    }, []);

    async function save(url: string) {
        setSaving(true);
        const prev = selected;
        setSelected(url);
        try {
            await apiFetch("/api/users/me/avatar", { method: "POST", body: JSON.stringify({ avatarUrl: url }) });
            toast({ message: "Avatar updated", variant: "success" });
        } catch (err) {
            setSelected(prev);
            toast({ message: err instanceof Error ? err.message : "Couldn't update avatar", variant: "error" });
        } finally {
            setSaving(false);
        }
    }

    if (options === null) {
        return (
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="aspect-square animate-pulse rounded-full bg-muted" />
                ))}
            </div>
        );
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