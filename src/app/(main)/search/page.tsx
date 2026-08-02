import Link from "next/link";
import { FiFileText, FiHeart, FiUsers } from "react-icons/fi";
import { auth } from "@/lib/auth";
import { listPosts } from "@/lib/services/post-service";
import { searchUsers } from "@/lib/services/user-service";
import { searchCommunities } from "@/lib/services/community-service";
import { PostCard } from "@/components/blog/PostCard";
import { FollowButton } from "@/components/profile/FollowButton";
import { Pagination } from "@/components/feed/Pagination";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchTabs } from "@/components/search/SearchTabs";

const PAGE_SIZE = 12;
type SearchType = "posts" | "people" | "communities";

type PageProps = {
    searchParams: Promise<{ q?: string; type?: string; page?: string }>;
};

export default async function SearchPage({ searchParams }: PageProps) {
    const { q, type: typeParam, page: pageParam } = await searchParams;
    const query = q?.trim() ?? "";
    const type: SearchType = typeParam === "people" || typeParam === "communities" ? typeParam : "posts";
    const page = Number(pageParam) || 1;

    const session = await auth();
    const viewerAuthorId = (session?.user as { id?: string } | undefined)?.id;
    const viewerId = viewerAuthorId ? BigInt(viewerAuthorId) : undefined;

    let totalPages = 1;
    let body;

    if (!query) {
        body = (
            <p className="mt-8 text-sm text-muted-foreground">
                Type something to search posts, people, or communities.
            </p>
        );
    } else if (type === "posts") {
        const result = await listPosts({
            page,
            pageSize: PAGE_SIZE,
            status: "published",
            search: query,
        }).catch(() => ({ items: [], total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 1 }));
        totalPages = result.totalPages;

        body =
            result.items.length === 0 ? (
                <p className="mt-8 text-sm text-muted-foreground">No posts found for "{query}".</p>
            ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {result.items.map((post) => (
                        <PostCard
                            key={post.articleid.toString()}
                            articleid={post.articleid.toString()}
                            title={post.title}
                            description={post.description}
                            postmedia={post.postmedia}
                            likes={post.likes}
                            commentscount={post.commentscount}
                            viewscount={post.viewscount}
                            author={post.blogger}
                        />
                    ))}
                </div>
            );
    } else if (type === "people") {
        const result = await searchUsers(query, viewerId, page, PAGE_SIZE).catch(() => ({
            items: [],
            total: 0,
            page: 1,
            pageSize: PAGE_SIZE,
            totalPages: 1,
        }));
        totalPages = result.totalPages;

        body =
            result.items.length === 0 ? (
                <p className="mt-8 text-sm text-muted-foreground">No people found for "{query}".</p>
            ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {result.items.map((person) => (
                        <div
                            key={person.authorid.toString()}
                            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
                        >
                            <Link href={`/profile/${person.username}`} className="flex items-center gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-base font-medium text-accent-foreground">
                                    {person.profilepicture ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={person.profilepicture} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        (person.name ?? person.username).charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">{person.name ?? person.username}</p>
                                    <p className="truncate text-xs text-muted-foreground">@{person.username}</p>
                                </div>
                            </Link>

                            {person.bio && <p className="line-clamp-2 text-sm text-muted-foreground">{person.bio}</p>}

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <FiFileText className="h-3.5 w-3.5" />
                                    {person.postsCount} posts
                                </span>
                                <span className="flex items-center gap-1">
                                    <FiHeart className="h-3.5 w-3.5" />
                                    {person.likesReceived} likes
                                </span>
                            </div>

                            {session?.user && (
                                <FollowButton
                                    username={person.username}
                                    initialFollowing={person.isFollowing}
                                    initialFollowersCount={0}
                                />
                            )}
                        </div>
                    ))}
                </div>
            );
    } else {
        const result = await searchCommunities(query, page, PAGE_SIZE).catch(() => ({
            items: [],
            total: 0,
            page: 1,
            pageSize: PAGE_SIZE,
            totalPages: 1,
        }));
        totalPages = result.totalPages;

        body =
            result.items.length === 0 ? (
                <p className="mt-8 text-sm text-muted-foreground">No communities found for "{query}".</p>
            ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {result.items.map((c) => (
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
            );
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
            <p className="font-mono-kicker text-muted-foreground">Search</p>
            <h1 className="mt-1 font-display text-2xl font-semibold">
                {query ? `Results for "${query}"` : "Search Tech2Xplore"}
            </h1>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <SearchBar />
                <SearchTabs activeType={type} />
            </div>

            {body}

            {query && <Pagination page={page} totalPages={totalPages} />}
        </div>
    );
}