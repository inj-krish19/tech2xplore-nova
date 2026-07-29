import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getPostById, incrementViewCount, isPrimaryAuthor } from "@/lib/services/post-service";
import { getUserReaction } from "@/lib/services/reaction-service";
import { listCollaborators } from "@/lib/services/collaboration-service";
import { hasLinkedInConnected } from "@/lib/services/user-service";
import { estimateReadTime } from "@/lib/utils/read-time";
import { PostEngagement } from "@/components/post/PostEngagement";
import { CommentSection } from "@/components/post/CommentSection";
import { CollaboratorPanel } from "@/components/post/CollaboratorPanel";
import { RelatedPosts } from "@/components/post/RelatedAndCollaborators";
import { LinkedInShareButton } from "@/components/post/LinkedInShareButton";

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const articleId = BigInt(id);

    const post = await getPostById(articleId).catch(() => null);
    if (!post) notFound();

    // Fire-and-forget per post-service.ts's own doc comment — never await this
    // in the render path.
    void incrementViewCount(articleId);

    const session = await auth();
    const viewerAuthorId = (session?.user as { authorid?: string } | undefined)?.authorid;
    const userReaction = viewerAuthorId
        ? await getUserReaction(BigInt(viewerAuthorId), articleId).catch(() => null)
        : null;

    const collaborators = await listCollaborators(articleId).catch(() => []);
    const canManageCollaborators = viewerAuthorId
        ? await isPrimaryAuthor(articleId, BigInt(viewerAuthorId)).catch(() => false)
        : false;

    const canShareToLinkedIn =
        canManageCollaborators && (await hasLinkedInConnected(post.blogger.authorid).catch(() => false));

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
                <article className="min-w-0">
                    <h1 className="font-display text-3xl font-semibold leading-tight">{post.title}</h1>
                    <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{post.blogger.name ?? post.blogger.username}</span>
                        <span aria-hidden>&middot;</span>
                        <span>{new Date(post.createdat ?? "").toLocaleDateString()}</span>
                        <span aria-hidden>&middot;</span>
                        <span>{estimateReadTime(post.description)} min read</span>
                        <span aria-hidden>&middot;</span>
                        <span>{post.viewscount} views</span>
                    </div>

                    {(post.postcategoryassignment.length > 0 || post.keywordassignment.length > 0) && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {post.postcategoryassignment.map((a) => (
                                <span key={a.categoryid.toString()} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                                    {a.category.name}
                                </span>
                            ))}
                            {post.keywordassignment.map((a) => (
                                <span key={a.keywordid.toString()} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                                    #{a.keyword.name}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <PostEngagement
                            postId={post.articleid.toString()}
                            initialLikes={post.likes}
                            initialDislikes={post.dislikes}
                            initialUserReaction={userReaction}
                            initialShares={post.shares}
                        />
                        {canShareToLinkedIn && <LinkedInShareButton postId={post.articleid.toString()} />}
                    </div>

                    <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none whitespace-pre-wrap text-sm leading-relaxed">
                        {post.description}
                    </div>

                    <div className="mt-10 border-t border-border pt-8">
                        <CommentSection postId={post.articleid.toString()} />
                    </div>
                </article>

                <aside className="flex flex-col gap-8">
                    <CollaboratorPanel
                        postId={post.articleid.toString()}
                        canManage={canManageCollaborators}
                        initialCollaborators={collaborators.map((c) => ({
                            authorid: c.authorid.toString(),
                            colloborationrole: c.colloborationrole,
                            blogger: {
                                authorid: c.blogger.authorid.toString(),
                                name: c.blogger.name,
                                username: c.blogger.username,
                                profilepicture: c.blogger.profilepicture,
                            },
                        }))}
                    />
                    <RelatedPosts postId={post.articleid.toString()} />
                </aside>
            </div>
        </div>
    );
}