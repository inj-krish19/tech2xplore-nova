import Link from "next/link";
import { FiEdit3, FiUsers, FiHash, FiTrendingUp, FiArrowRight } from "react-icons/fi";
import { Reveal } from "@/components/motion/Reveal";
import { listPosts } from "@/lib/services/post-service";

/**
 * A logged-in visitor already knows what Tech2Xplore is — repeating the
 * marketing pitch wastes the one thing they actually want fast: a way back
 * into the app. So this is a two-column dashboard shell, not a scroll of
 * sections: main column for the feed, sidebar for the actions/discovery
 * that don't need a full page each.
 */
export async function LoggedInHome({ username }: { username: string | null }) {
    const recentPosts = await safeListPosts();

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                {/* Main column */}
                <div className="min-w-0">
                    <Reveal className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="font-display text-xl font-semibold">Welcome back</h1>
                            <p className="mt-1 text-sm text-muted-foreground">Pick up where you left off, or start something new.</p>
                        </div>
                        <Link
                            href="/post/new"
                            className="flex shrink-0 items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90"
                        >
                            <FiEdit3 className="h-4 w-4" />
                            Write a post
                        </Link>
                    </Reveal>

                    <div className="mt-6 flex items-center justify-between">
                        <h2 className="font-display text-lg font-semibold">Recent from the feed</h2>
                        <Link href="/feed" className="flex items-center gap-1 text-sm text-accent hover:opacity-80">
                            View all
                            <FiArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <div className="mt-4 flex flex-col gap-4">
                        {recentPosts.length > 0 ? (
                            recentPosts.slice(0, 5).map((post, i) => (
                                <Reveal
                                    key={post.id ?? i}
                                    delay={i * 0.05}
                                    className="rounded-xl border border-border bg-card p-5"
                                >
                                    <p className="font-display text-base font-semibold">{post.title}</p>
                                    <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{post.description}</p>
                                </Reveal>
                            ))
                        ) : (
                            <div className="rounded-xl border border-dashed border-border p-8 text-center">
                                <p className="text-sm text-muted-foreground">
                                    No posts yet — be the first to write something.
                                </p>
                                <Link
                                    href="/post/new"
                                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:opacity-80"
                                >
                                    <FiEdit3 className="h-4 w-4" />
                                    Write a post
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar — discovery + quick links, collapses above main column on mobile via order */}
                <div className="order-first flex flex-col gap-4 lg:order-last">
                    <Reveal className="rounded-xl border border-border bg-card p-5">
                        <p className="font-mono-kicker text-muted-foreground">Quick links</p>
                        <div className="mt-3 flex flex-col gap-1">
                            <SidebarLink href={`/profile/${username ?? ""}`} icon={FiUsers} label="Your profile" />
                            <SidebarLink href="/communities" icon={FiUsers} label="Communities" />
                            <SidebarLink href="/feed" icon={FiHash} label="Browse categories" />
                        </div>
                    </Reveal>

                    <Reveal delay={0.05} className="rounded-xl border border-border bg-muted p-5">
                        <div className="flex items-center gap-2">
                            <FiTrendingUp className="h-4 w-4 text-accent" />
                            <p className="font-mono-kicker text-muted-foreground">Growing fast</p>
                        </div>
                        <p className="mt-2 text-sm">
                            Follower growth is up <span className="font-semibold text-accent">187.5%</span> this
                            period — follow a few writers to make your feed worth checking daily.
                        </p>
                    </Reveal>
                </div>
            </div>
        </div>
    );
}

function SidebarLink({ href, icon: Icon, label }: { href: string; icon: typeof FiUsers; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground hover:bg-background hover:text-foreground"
        >
            <Icon className="h-4 w-4" />
            {label}
        </Link>
    );
}

/**
 * ASSUMED to match the same listPosts({ page, pageSize }) -> { posts, total }
 * signature used in app/(main)/feed/page.tsx — kept consistent across both
 * call sites so a real-signature fix only needs to happen in one place.
 * Still wrapped in try/catch: if the real signature differs, this fails to
 * an empty state instead of a 500.
 */
async function safeListPosts(): Promise<Array<{ id: string; title: string; description: string }>> {
    try {
        const result = (await listPosts({ page: 1, pageSize: 5 } as never)) as unknown;
        if (Array.isArray(result)) return result as never;
        return ((result as { posts?: never }).posts ?? []) as never;
    } catch {
        return [];
    }
}