import { notFound } from "next/navigation";
import { getPostById, incrementViewCount } from "@/lib/services/post-service";
import { db } from "@/lib/db";
import { CommentThread, type CommentNode } from "@/components/blog/CommentThread";

function buildCommentTree(
    flat: {
        postcommentid: bigint;
        comment: string;
        createdat: Date;
        parentcommentid: bigint | null;
        blogger: { username: string; name: string; profilepicture: string | null };
    }[]
): CommentNode[] {
    const byId = new Map<string, CommentNode>();
    const roots: CommentNode[] = [];

    for (const c of flat) {
        byId.set(c.postcommentid.toString(), {
            id: c.postcommentid.toString(),
            comment: c.comment,
            createdAt: c.createdat.toISOString(),
            author: c.blogger,
            replies: [],
        });
    }

    for (const c of flat) {
        const node = byId.get(c.postcommentid.toString())!;
        if (c.parentcommentid) {
            byId.get(c.parentcommentid.toString())?.replies.push(node);
        } else {
            roots.push(node);
        }
    }

    return roots;
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const articleId = BigInt(id);
    const post = await getPostById(articleId);
    if (!post) notFound();

    // Fire-and-forget — don't block the page render on this write.
    incrementViewCount(articleId).catch((err) => console.error("[VIEW_COUNT_FAILED]", err));

    const comments = await db.postcomment.findMany({
        where: { articleid: articleId },
        orderBy: { createdat: "asc" },
        select: {
            postcommentid: true,
            comment: true,
            createdat: true,
            parentcommentid: true,
            blogger: { select: { username: true, name: true, profilepicture: true } },
        },
    });

    return (
        <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
            <div>
                <h1 className="text-2xl font-semibold">{post.title}</h1>
                <p className="mt-1 text-sm text-muted-foreground">by {post.blogger.name}</p>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{post.description}</p>
            <hr className="border-border" />
            <h2 className="text-sm font-semibold">Comments</h2>
            <CommentThread comments={buildCommentTree(comments)} />
        </div>
    );
}