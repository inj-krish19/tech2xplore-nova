"use client";

import { useState } from "react";

export function SetPasswordForm() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const res = await fetch("/api/auth/set-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });
        const json = await res.json();
        setLoading(false);

        if (!json.success) {
            setError(json.error ?? "Something went wrong");
            return;
        }
        setDone(true);
    }

    if (done) {
        return <p className="text-sm">Password set — you can now log in with your email too.</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
                You signed up with Google or LinkedIn. Add a password to also log in with your email.
            </p>
            <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                className="rounded-md border border-border px-3 py-2.5 text-sm"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-foreground text-background py-2.5 text-sm font-medium disabled:opacity-50"
            >
                {loading ? "Saving…" : "Set password"}
            </button>
        </form>
    );
}