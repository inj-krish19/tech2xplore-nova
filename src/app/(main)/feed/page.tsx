import Link from "next/link";
import { FeedFilters } from "@/components/feed/FeedFilters";
import { Pagination } from "@/components/feed/Pagination";
import { listPosts } from "@/lib/services/post-service";

const PAGE_SIZE = 10;

export default async function FeedPage({
    searchParams,
}: {
    searchParams: Promise<{ categoryId?: string; keywordId?: string; page?: string }>;
}) {
    const { categoryId, keywordId, page: pageParam } = await searchParams;
    const page = Number(pageParam) || 1;

    // listPosts now really supports keywordId (previously accepted by the
    // query schema but silently ignored in the where clause) — the
    // `as never` cast this used to need is gone, along with the manual
    // total/totalPages math this file was doing itself.
    //
    // Also newly added: status: "published". This page had no status
    // filter at all before, meaning drafts and archived posts were
    // showing up in the public feed.
    const result = await listPosts({
        categoryId,
        keywordId,
        page,
        pageSize: PAGE_SIZE,
        status: "published",
    }).catch(() => ({ items: [], total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 1 }));

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
            <h1 className="font-display text-2xl font-semibold">Feed</h1>

            <div className="mt-4">
                <FeedFilters />
            </div>

            <div className="mt-6 flex flex-col gap-4">
                {result.items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No posts match these filters.</p>
                ) : (
                    result.items.map((post) => (
                        <Link
                            key={post.articleid.toString()}
                            href={`/post/${post.articleid}`}
                            className="block rounded-xl border border-border bg-card p-5 hover:border-accent"
                        >
                            <p className="font-display text-lg font-semibold">{post.title}</p>
                            <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{post.description}</p>
                        </Link>
                    ))
                )}
            </div>

            <Pagination page={page} totalPages={result.totalPages} />
        </div>
    );
}