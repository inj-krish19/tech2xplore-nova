"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSend } from "react-icons/fi";
import { CategoryKeywordPicker } from "@/components/post/CategoryKeywordPicker";
import { usePromiseToast } from "@/hooks/usePromiseToast";
import { apiFetch } from "@/lib/api-client";

/** ASSUMED: POST /api/posts body { title, content, categoryIds, keywordIds } -> { id } */
export default function NewPostPage() {
    const router = useRouter();
    const promiseToast = usePromiseToast();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categoryIds, setCategoryIds] = useState<string[]>([]);
    const [keywordIds, setKeywordIds] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const canSubmit = title.trim().length > 0 && content.trim().length > 0 && !submitting;

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        if (!canSubmit) return;
        setSubmitting(true);
        try {
            const post = await promiseToast(
                apiFetch<{ id: string }>("/api/posts", {
                    method: "POST",
                    body: JSON.stringify({ title, content, categoryIds, keywordIds }),
                }),
                {
                    loading: "Publishing post...",
                    success: "Post published",
                    error: (err) => (err instanceof Error ? err.message : "Couldn't publish post"),
                }
            );
            router.push(`/post/${post.id}`);
        } catch {
            // toast already shown by promiseToast
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
            <h1 className="font-display text-2xl font-semibold">Write a post</h1>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
                <div>
                    <label htmlFor="title" className="text-sm font-medium">Title</label>
                    <input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Give your post a clear title"
                        className="mt-2 w-full rounded-md border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-accent"
                    />
                </div>

                <div>
                    <label htmlFor="content" className="text-sm font-medium">Content</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={14}
                        placeholder="Write your post..."
                        className="mt-2 w-full resize-y rounded-md border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-accent"
                    />
                </div>

                <CategoryKeywordPicker
                    selectedCategoryIds={categoryIds}
                    selectedKeywordIds={keywordIds}
                    onChangeCategories={setCategoryIds}
                    onChangeKeywords={setKeywordIds}
                />

                <div className="flex justify-end gap-3 border-t border-border pt-6">
                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
                    >
                        <FiSend className="h-4 w-4" />
                        {submitting ? "Publishing..." : "Publish"}
                    </button>
                </div>
            </form>
        </div>
    );
}