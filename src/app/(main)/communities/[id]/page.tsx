import { notFound } from "next/navigation";
import Link from "next/link";
import { FiUsers } from "react-icons/fi";
import { auth } from "@/lib/auth";
import { getCommunityById, listCommunityMembers } from "@/lib/services/community-service";
import { CommunityJoinButton } from "@/components/community/CommunityJoinButton";

export default async function CommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const communityId = BigInt(id);

    const community = await getCommunityById(communityId).catch(() => null);
    if (!community) notFound();

    const members = await listCommunityMembers(communityId).catch(() => []);

    const session = await auth();
    const viewerAuthorId = (session?.user as { authorid?: string } | undefined)?.authorid;
    const isMember = viewerAuthorId
        ? members.some((m) => m.authorid.toString() === viewerAuthorId)
        : false;

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-display text-2xl font-semibold">{community.name}</h1>
                    <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{community.communitydescription}</p>
                </div>
                {session?.user && (
                    <CommunityJoinButton
                        communityId={communityId.toString()}
                        initialIsMember={isMember}
                        initialMemberCount={community._count.membership}
                    />
                )}
            </div>

            <div className="mt-8">
                <div className="flex items-center gap-1.5">
                    <FiUsers className="h-4 w-4 text-muted-foreground" />
                    <h2 className="font-display text-base font-semibold">Members ({members.length})</h2>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {members.map((m) => (
                        <Link
                            key={m.membershipid.toString()}
                            href={`/profile/${m.blogger.username}`}
                            className="flex items-center gap-3 rounded-md border border-border bg-card p-3 hover:border-accent"
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-xs font-medium text-accent-foreground">
                                {m.blogger.profilepicture ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={m.blogger.profilepicture} alt="" className="h-full w-full object-cover" />
                                ) : (
                                    (m.blogger.name ?? m.blogger.username).charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium">{m.blogger.name ?? m.blogger.username}</p>
                                <p className="text-xs capitalize text-muted-foreground">{m.membershiprole}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}