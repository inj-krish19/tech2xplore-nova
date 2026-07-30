"use client";

import { useState } from "react";
import { FiSave } from "react-icons/fi";
import { apiFetch } from "@/lib/api-client";
import { useToast } from "@/components/ui/Toast";

/** ASSUMED: PATCH /api/users/me body { name, bio } -> updated blogger row */
export function SettingsForm({
    initialName,
    initialBio,
}: {
    initialName: string;
    initialBio: string | null;
}) {
    const [name, setName] = useState(initialName);
    const [bio, setBio] = useState(initialBio ?? "");
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    async function save() {
        setSaving(true);
        try {
            await apiFetch("/api/users/me", { method: "PATCH", body: JSON.stringify({ name, bio }) });
            toast({ message: "Profile updated", variant: "success" });
        } catch (err) {
            toast({ message: err instanceof Error ? err.message : "Couldn't save changes", variant: "error" });
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div>
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={30}
                    className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                />
            </div>

            <div>
                <label htmlFor="bio" className="text-sm font-medium">Bio</label>
                <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    maxLength={250}
                    placeholder="Tell people a bit about yourself"
                    className="mt-2 w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                />
                <p className="mt-1 text-right text-xs text-muted-foreground">{bio.length}/250</p>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={save}
                    disabled={saving || !name.trim()}
                    className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
                >
                    <FiSave className="h-4 w-4" />
                    {saving ? "Saving..." : "Save changes"}
                </button>
            </div>
        </div>
    );
}