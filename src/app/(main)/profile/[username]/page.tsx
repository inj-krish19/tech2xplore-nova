import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PostCard } from "@/components/blog/PostCard";

export default async function ProfilePage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = await params;

    const blogger = await db.blogger.findUnique({
        where: { username },
        select: {
            authorid: true,
            name: true,
            username: true,
            bio: true,
            profilepicture: true,
        },
    });
    if (!blogger) notFound();

    const posts = await db.post.findMany({
        where: { primaryauthor: blogger.authorid, poststatus: "published" },
        orderBy: { createdat: "desc" },
    });

    return (
        <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
            <div>
                <h1 className="text-xl font-semibold">{blogger.name}</h1>
                <p className="text-sm text-muted-foreground">@{blogger.username}</p>
                {blogger.bio && <p className="mt-2 text-sm">{blogger.bio}</p>}
            </div>
            <div className="flex flex-col gap-4">
                {posts.map((post) => (
                    <PostCard
                        key={post.articleid.toString()}
                        articleid={post.articleid.toString()}
                        title={post.title}
                        description={post.description}
                        postmedia={post.postmedia}
                        likes={post.likes}
                        commentscount={post.commentscount}
                        viewscount={post.viewscount}
                        author={{ username: blogger.username, name: blogger.name, profilepicture: blogger.profilepicture }}
                    />
                ))}
            </div>
        </div>
    );
}