import { listPosts } from "@/lib/services/post-service";
import { PostCard } from "@/components/blog/PostCard";

export default async function FeedPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const { page: pageParam } = await searchParams;
    const page = Number(pageParam ?? "1");
    const { items } = await listPosts({ page, pageSize: 10, status: "published" });

    return (
        <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-8">
            {items.length === 0 && (
                <p className="text-sm text-muted-foreground">No posts yet — be the first to write one.</p>
            )}
            {items.map((post) => (
                <PostCard
                    key={post.articleid.toString()}
                    articleid={post.articleid.toString()}
                    title={post.title}
                    description={post.description}
                    postmedia={post.postmedia}
                    likes={post.likes}
                    commentscount={post.commentscount}
                    viewscount={post.viewscount}
                    author={{
                        username: post.blogger.username,
                        name: post.blogger.name,
                        profilepicture: post.blogger.profilepicture,
                    }}
                />
            ))}
        </div>
    );
}