import Link from "next/link";
import { FiUsers, FiPlus } from "react-icons/fi";
import { auth } from "@/lib/auth";
import { listCommunities } from "@/lib/services/community-service";
import { Pagination } from "@/components/feed/Pagination";

const PAGE_SIZE = 12;

export default async function CommunitiesPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const { page: pageParam } = await searchParams;
    const page = Number(pageParam) || 1;

    const session = await auth();
    const isLoggedIn = Boolean(session?.user);

    const { items: communities, totalPages } = await listCommunities(page, PAGE_SIZE).catch(() => ({
        items: [],
        totalPages: 1,
    }));

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
            <div className="flex items-center justify-between gap-4">
                <h1 className="font-display text-2xl font-semibold">Communities</h1>
                {isLoggedIn && (
                    <Link
                        href="/communities/new"
                        className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
                    >
                        <FiPlus className="h-4 w-4" />
                        Create
                    </Link>
                )}
            </div>

            {communities.length === 0 ? (
                <p className="mt-8 text-sm text-muted-foreground">No communities yet — be the first to start one.</p>
            ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {communities.map((c) => (
                        <Link
                            key={c.communityid.toString()}
                            href={`/communities/${c.communityid}`}
                            className="rounded-xl border border-border bg-card p-5 hover:border-accent"
                        >
                            <p className="font-display text-lg font-semibold">{c.name}</p>
                            <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{c.communitydescription}</p>
                            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                                <FiUsers className="h-3.5 w-3.5" />
                                {c._count.membership} members
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <Pagination page={page} totalPages={totalPages} />
        </div>
    );
}