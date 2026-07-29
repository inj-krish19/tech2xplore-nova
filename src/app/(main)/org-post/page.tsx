import Link from "next/link";
import { listOrgPosts } from "@/lib/services/orgpost-service";
import { Pagination } from "@/components/feed/Pagination";

const PAGE_SIZE = 12;

export default async function OrgPostsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const { page: pageParam } = await searchParams;
    const page = Number(pageParam) || 1;

    const { items: posts, totalPages } = await listOrgPosts(page, PAGE_SIZE).catch(() => ({
        items: [],
        totalPages: 1,
    }));

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
            <p className="font-mono-kicker text-muted-foreground">From Tech2Xplore</p>
            <h1 className="mt-1 font-display text-2xl font-semibold">Company posts</h1>

            {posts.length === 0 ? (
                <p className="mt-8 text-sm text-muted-foreground">Nothing here yet.</p>
            ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <Link
                            key={post.orgpostid.toString()}
                            href={`/org-posts/${post.orgpostid}`}
                            className="block overflow-hidden rounded-xl border border-border bg-card hover:border-accent"
                        >
                            {post.coverimage && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={post.coverimage} alt="" className="h-36 w-full object-cover" />
                            )}
                            <div className="p-4">
                                <p className="font-display text-base font-semibold line-clamp-2">
                                    {post.title ?? "Untitled"}
                                </p>
                                {post.publishedat && (
                                    <p className="mt-1.5 text-xs text-muted-foreground">
                                        {new Date(post.publishedat).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <Pagination page={page} totalPages={totalPages} />
        </div>
    );
}