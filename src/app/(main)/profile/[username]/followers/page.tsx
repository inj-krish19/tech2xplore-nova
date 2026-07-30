import Link from "next/link";
import { notFound } from "next/navigation";
import { getBloggerByUsername, listFollowers } from "@/lib/services/user-service";

export default async function FollowersPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const blogger = await getBloggerByUsername(username).catch(() => null);
    if (!blogger) notFound();

    const followers = await listFollowers(blogger.authorid).catch(() => []);

    return (
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
            <p className="font-mono-kicker text-muted-foreground">
                <Link href={`/profile/${username}`} className="hover:text-accent">@{username}</Link>
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold">Followers ({followers.length})</h1>

            {followers.length === 0 ? (
                <p className="mt-8 text-sm text-muted-foreground">No followers yet.</p>
            ) : (
                <div className="mt-6 flex flex-col gap-3">
                    {followers.map((f) => (
                        <Link
                            key={f.authorid.toString()}
                            href={`/profile/${f.username}`}
                            className="flex items-center gap-3 rounded-md border border-border bg-card p-3 hover:border-accent"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-sm font-medium text-accent-foreground">
                                {f.profilepicture ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={f.profilepicture} alt="" className="h-full w-full object-cover" />
                                ) : (
                                    (f.name ?? f.username).charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium">{f.name ?? f.username}</p>
                                <p className="truncate text-xs text-muted-foreground">@{f.username}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}