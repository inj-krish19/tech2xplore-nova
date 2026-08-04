import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

/**
 * Root-level (src/app/not-found.tsx), not inside (main)/ — this needs
 * to catch unmatched routes across the whole app, not just the (main)
 * group. That means it doesn't get Header/Footer for free the way
 * pages inside (main)/layout.tsx do, so this is intentionally
 * self-contained rather than trying to import and re-wrap those.
 */
export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center text-foreground">
            <p className="font-mono-kicker text-muted-foreground">404</p>
            <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">This page doesn't exist</h1>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                The link might be broken, or the page may have moved. Either way, it's not here.
            </p>
            <Link
                href="/home"
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90"
            >
                <FiArrowLeft className="h-4 w-4" />
                Back to home
            </Link>
        </div>
    );
}