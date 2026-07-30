import Link from "next/link";
import { FiFileText, FiHeart } from "react-icons/fi";
import { auth } from "@/lib/auth";
import { listDiscoverableUsers } from "@/lib/services/user-service";
import { FollowButton } from "@/components/profile/FollowButton";
import { Pagination } from "@/components/feed/Pagination";

const PAGE_SIZE = 12;

export default async function DiscoverPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const { page: pageParam } = await searchParams;
    const page = Number(pageParam) || 1;

    const session = await auth();
    const viewerAuthorId = (session?.user as { id?: string } | undefined)?.id;
    const viewerId = viewerAuthorId ? BigInt(viewerAuthorId) : undefined;

    const { items: people, totalPages } = await listDiscoverableUsers(viewerId, page, PAGE_SIZE).catch(() => ({
        items: [],
        totalPages: 1,
    }));

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
            <p className="font-mono-kicker text-muted-foreground">Discover</p>
            <h1 className="mt-1 font-display text-2xl font-semibold">People to follow</h1>

            {people.length === 0 ? (
                <p className="mt-8 text-sm text-muted-foreground">Nobody to show yet.</p>
            ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {people.map((person) => (
                        <div key={person.authorid.toString()} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
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
            )}

            <Pagination page={page} totalPages={totalPages} />
        </div>
    );
}