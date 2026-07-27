import Link from "next/link";
import { auth } from "@/lib/auth";
import { HeaderNav } from "@/components/layout/HeaderNav";

/**
 * Server component: resolves the session once, passes down only what the
 * client nav needs to render (name/username/image) — never the full session
 * object, to keep the client bundle payload small and avoid leaking anything
 * beyond display data.
 */
export async function Header() {
    const session = await auth();
    const user = session?.user
        ? {
            name: session.user.name ?? null,
            username: (session.user as { username?: string }).username ?? null,
            image: session.user.image ?? null,
        }
        : null;

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                <Link href="/" className="flex items-center gap-2 shrink-0">
                    <span className="font-display text-lg font-semibold">Tech2Xplore</span>
                </Link>

                <HeaderNav user={user} />
            </div>
        </header>
    );
}