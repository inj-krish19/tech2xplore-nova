"use client";

import { useToast } from "@/components/ui/Toast";

type PromiseToastOptions<T> = {
    loading: string;
    success: string | ((result: T) => string);
    error: string | ((error: unknown) => string);
};

/**
 * Wraps an async action with a loading toast that flips to success/error —
 * the pattern every Phase 1 wiring task (react, comment, follow, share...)
 * needs, written once here instead of duplicated per component.
 *
 * Usage:
 *   const promiseToast = usePromiseToast();
 *   await promiseToast(fetch("/api/posts/1/react", { method: "POST" }), {
 *     loading: "Reacting...",
 *     success: "Reaction added",
 *     error: "Couldn't react, try again",
 *   });
 */
export function usePromiseToast() {
    const { toast, update } = useToast();

    return async function promiseToast<T>(promise: Promise<T>, options: PromiseToastOptions<T>): Promise<T> {
        const id = toast({ message: options.loading, variant: "loading" });
        try {
            const result = await promise;
            const message = typeof options.success === "function" ? options.success(result) : options.success;
            update(id, { message, variant: "success" });
            return result;
        } catch (err) {
            const message = typeof options.error === "function" ? options.error(err) : options.error;
            update(id, { message, variant: "error" });
            throw err;
        }
    };
}