"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FiArrowLeft, FiRefreshCw } from "react-icons/fi";

/**
 * Root-level (src/app/error.tsx) — Next.js requires this to be a Client
 * Component, since it receives `error` and `reset` at render time as an
 * error boundary, not through normal server-rendered props. Same
 * self-contained styling reasoning as not-found.tsx: this sits outside
 * the (main) layout's Header/Footer.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        // Server-side logging only reaches the server console right now —
        // wiring this to a real error-tracking service (Sentry or similar)
        // is a FUTURE_WORK.md item, not something this file does on its own.
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center text-foreground">
            <p className="font-mono-kicker text-muted-foreground">500</p>
            <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Something went wrong</h1>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                That's on us, not you. Try again, or head back to home if it keeps happening.
            </p>
            <div className="mt-6 flex items-center gap-3">
                <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90"
                >
                    <FiRefreshCw className="h-4 w-4" />
                    Try again
                </button>
                <Link
                    href="/home"
                    className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted"
                >
                    <FiArrowLeft className="h-4 w-4" />
                    Home
                </Link>
            </div>
        </div>
    );
}