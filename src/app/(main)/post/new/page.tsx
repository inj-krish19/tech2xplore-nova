"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function NewPostPage() {
    const router = useRouter();
    const { status } = useSession();
    const [form, setForm] = useState({ title: "", description: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (status === "loading") return null;
    if (status === "unauthenticated") {
        router.push("/login?callbackUrl=/post/new");
        return null;
    }

    async function handleSubmit(e: React.FormEvent, poststatus: "draft" | "published") {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const res = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, poststatus }),
        });
        const json = await res.json();
        setLoading(false);

        if (!json.success) {
            setError(json.error ?? "Something went wrong");
            return;
        }
        router.push(`/post/${json.data.articleid}`);
    }

    return (
        <form className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-8">
            <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Title"
                className="rounded-md border border-border px-3 py-2.5 text-lg font-medium"
            />
            <textarea
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Write your post…"
                rows={12}
                maxLength={3000}
                className="rounded-md border border-border px-3 py-2.5 text-sm"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-3">
                <button
                    type="button"
                    disabled={loading}
                    onClick={(e) => handleSubmit(e, "draft")}
                    className="rounded-md border border-border px-4 py-2 text-sm font-medium disabled:opacity-50"
                >
                    Save draft
                </button>
                <button
                    type="button"
                    disabled={loading}
                    onClick={(e) => handleSubmit(e, "published")}
                    className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
                >
                    Publish
                </button>
            </div>
            {/* NOTE: Tiptap rich-text editor + category/keyword pickers intentionally
          left as a plain textarea for now — swap in once the editor
          component itself is on the agenda. */}
        </form>
    );
}