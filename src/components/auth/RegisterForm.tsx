"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export function RegisterForm() {
    const searchParams = useSearchParams();
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: searchParams.get("email") ?? "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        const json = await res.json();
        setLoading(false);

        if (!json.success) {
            setError(json.error ?? "Something went wrong");
            return;
        }
        setSent(true);
    }

    if (sent) {
        return (
            <p className="text-sm">
                Check <strong>{form.email}</strong> for a verification link — it expires in 10 minutes.
                Didn&apos;t get it? Refresh this page and submit again for a new link.
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full name"
                className="rounded-md border border-border px-3 py-2.5 text-sm"
            />
            <input
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Username"
                className="rounded-md border border-border px-3 py-2.5 text-sm"
            />
            <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                className="rounded-md border border-border px-3 py-2.5 text-sm"
            />
            <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Password"
                className="rounded-md border border-border px-3 py-2.5 text-sm"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-foreground text-background py-2.5 text-sm font-medium disabled:opacity-50"
            >
                {loading ? "Sending link…" : "Create account"}
            </button>
        </form>
    );
}