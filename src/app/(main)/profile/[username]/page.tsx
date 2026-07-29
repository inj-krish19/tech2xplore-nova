import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProfileByUsername, listRelatedUsers } from "@/lib/services/user-service";
import { FollowButton } from "@/components/profile/FollowButton";
import { AvatarPicker } from "@/components/profile/AvatarPicker";
import { RelatedUsers } from "@/components/profile/RelatedUsers";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const session = await auth();
    // ASSUMED: session.user carries an authorid field matching the blogger table's
    // bigint PK — adjust if your session callback names/shapes this differently.
    const viewerAuthorId = (session?.user as { id?: string } | undefined)?.id;
    const viewerId = viewerAuthorId ? BigInt(viewerAuthorId) : undefined;

    const profile = await getProfileByUsername(username, viewerId).catch(() => null);
    if (!profile) notFound();

    const relatedUsers = await listRelatedUsers(username, viewerId).catch(() => []);

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-lg font-medium text-accent-foreground">
                        {profile.profilepicture ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={profile.profilepicture} alt="" className="h-full w-full object-cover" />
                        ) : (
                            (profile.name ?? profile.username).charAt(0).toUpperCase()
                        )}
                    </div>
                    <div>
                        <h1 className="font-display text-xl font-semibold">{profile.name ?? profile.username}</h1>
                        <p className="text-sm text-muted-foreground">@{profile.username} &middot; {profile.followersCount} followers</p>
                    </div>
                </div>

                {!profile.isOwnProfile && (
                    <FollowButton
                        username={profile.username}
                        initialFollowing={profile.isFollowing}
                        initialFollowersCount={profile.followersCount}
                    />
                )}
            </div>

            {profile.bio && <p className="mt-4 max-w-2xl text-sm text-muted-foreground">{profile.bio}</p>}

            {profile.isOwnProfile && (
                <div className="mt-8 rounded-xl border border-border bg-card p-5">
                    <h2 className="font-display text-base font-semibold">Choose your avatar</h2>
                    <div className="mt-4">
                        <AvatarPicker currentAvatarUrl={profile.profilepicture} />
                    </div>
                </div>
            )}

            {relatedUsers.length > 0 && (
                <div className="mt-10">
                    <RelatedUsers
                        username={profile.username}
                        // real shape from listRelatedUsers — mapped to what RelatedUsers expects
                        preloaded={relatedUsers.map((u) => ({
                            username: u.username,
                            name: u.name,
                            image: u.profilepicture,
                        }))}
                    />
                </div>
            )}
        </div>
    );
}