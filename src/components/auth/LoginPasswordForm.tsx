"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export function LoginPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") ?? "";
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError("Incorrect password. Try again.");
            return;
        }

        router.push("/feed");
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">Signing in as {email}</p>
            <input
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="rounded-md border border-border px-3 py-2.5 text-sm"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-foreground text-background py-2.5 text-sm font-medium disabled:opacity-50"
            >
                {loading ? "Signing in…" : "Sign in"}
            </button>
        </form>
    );
}