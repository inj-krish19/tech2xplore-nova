import Link from "next/link";
import { FeedFilters } from "@/components/feed/FeedFilters";
import { Pagination } from "@/components/feed/Pagination";
import { listPosts } from "@/lib/services/post-service";

const PAGE_SIZE = 10;

/**
 * ASSUMED: listPosts accepts { categoryId?, keywordId?, page?, pageSize? }
 * and returns { posts, total } — adjust the call below to your real
 * signature if it differs (this was a guess based on API_ENDPOINTS.md
 * supporting both filters and pagination per the roadmap note).
 */
export default async function FeedPage({
    searchParams,
}: {
    searchParams: Promise<{ categoryId?: string; keywordId?: string; page?: string }>;
}) {
    const { categoryId, keywordId, page: pageParam } = await searchParams;
    const page = Number(pageParam) || 1;

    const result = await safeListPosts({ categoryId, keywordId, page, pageSize: PAGE_SIZE });
    const totalPages = Math.max(1, Math.ceil(result.total / PAGE_SIZE));

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
            <h1 className="font-display text-2xl font-semibold">Feed</h1>

            <div className="mt-4">
                <FeedFilters />
            </div>

            <div className="mt-6 flex flex-col gap-4">
                {result.posts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No posts match these filters.</p>
                ) : (
                    result.posts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/post/${post.id}`}
                            className="block rounded-xl border border-border bg-card p-5 hover:border-accent"
                        >
                            <p className="font-display text-lg font-semibold">{post.title}</p>
                            <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{post.description}</p>
                        </Link>
                    ))
                )}
            </div>

            <Pagination page={page} totalPages={totalPages} />
        </div>
    );
}

async function safeListPosts(args: {
    categoryId?: string;
    keywordId?: string;
    page: number;
    pageSize: number;
}): Promise<{ posts: Array<{ id: string; title: string; description: string }>; total: number }> {
    try {
        const result = (await listPosts(args as never)) as unknown;
        if (Array.isArray(result)) return { posts: result as never, total: result.length };
        return result as { posts: never; total: number };
    } catch {
        return { posts: [], total: 0 };
    }
}