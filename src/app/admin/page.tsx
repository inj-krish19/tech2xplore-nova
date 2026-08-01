import { db } from "@/lib/db";
import { PostModerationTable } from "@/components/admin/PostModerationTable";

export default async function AdminOverviewPage() {
    const posts = await db.post.findMany({
        orderBy: { createdat: "desc" },
        take: 50,
        include: { blogger: { select: { username: true } } },
    });

    const moderationPosts = posts.map((p) => ({
        id: p.articleid.toString(),
        title: p.title,
        authorUsername: p.blogger.username,
        status: p.poststatus ?? "draft",
        createdAt: (p.createdat ?? new Date()).toISOString(),
    }));

    return (
        <>
            <h1 className="mb-6 text-xl font-semibold">Moderation — recent posts</h1>
            <PostModerationTable posts={moderationPosts} />
        </>
    );
}