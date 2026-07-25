"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function EmailStepForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/auth/check-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const json = await res.json();

            if (!json.success) {
                setError(json.error ?? "Something went wrong");
                return;
            }

            const { exists, hasPassword } = json.data;
            const encodedEmail = encodeURIComponent(email);

            if (!exists) {
                router.push(`/register?email=${encodedEmail}`);
            } else if (hasPassword) {
                router.push(`/login/password?email=${encodedEmail}`);
            } else {
                // OAuth-only account — must prove identity via provider first
                router.push(`/login?info=oauth_only&email=${encodedEmail}`);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="rounded-md border border-border px-3 py-2.5 text-sm"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-foreground text-background py-2.5 text-sm font-medium disabled:opacity-50"
            >
                {loading ? "Checking…" : "Continue"}
            </button>
        </form>
    );
}