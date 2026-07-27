import Link from "next/link";
import { notFound } from "next/navigation";
import {
    getKeywordById,
    listPostsByKeyword,
    recentAuthorsByKeyword,
} from "@/lib/services/keyword-service";

const PAGE_SIZE = 10;

export default async function KeywordPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ page?: string }>;
}) {
    const { id } = await params;
    const { page: pageParam } = await searchParams;
    const page = Number(pageParam) || 1;

    const keywordId = BigInt(id);
    const keyword = await getKeywordById(keywordId).catch(() => null);
    if (!keyword) notFound();

    const [{ items: posts }, recentAuthors] = await Promise.all([
        listPostsByKeyword(keywordId, page, PAGE_SIZE),
        recentAuthorsByKeyword(keywordId),
    ]);

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
            <p className="font-mono-kicker text-muted-foreground">Keyword</p>
            <h1 className="mt-1 font-display text-2xl font-semibold">#{keyword.name}</h1>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_240px]">
                <div className="flex flex-col gap-4">
                    {posts.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No posts tagged with this keyword yet.</p>
                    ) : (
                        posts.map((post) => (
                            <Link
                                key={post.articleid.toString()}
                                href={`/post/${post.articleid}`}
                                className="block rounded-xl border border-border bg-card p-5 hover:border-accent"
                            >
                                <p className="font-display text-lg font-semibold">{post.title}</p>
                                <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{post.description}</p>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    {post.blogger.name ?? post.blogger.username}
                                </p>
                            </Link>
                        ))
                    )}
                </div>

                {recentAuthors.length > 0 && (
                    <aside>
                        <h2 className="font-display text-base font-semibold">Recent authors</h2>
                        <div className="mt-3 flex flex-col gap-2">
                            {recentAuthors.map((a) => (
                                <Link
                                    key={a.authorid.toString()}
                                    href={`/profile/${a.username}`}
                                    className="text-sm text-muted-foreground hover:text-accent"
                                >
                                    {a.name ?? a.username}
                                </Link>
                            ))}
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
}