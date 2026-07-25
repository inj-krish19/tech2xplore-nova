import Link from "next/link";

interface PostCardProps {
    articleid: string;
    title: string;
    description: string;
    postmedia?: string | null;
    likes: number;
    commentscount: number;
    viewscount: number;
    author: { username: string; name: string; profilepicture?: string | null };
}

export function PostCard({
    articleid,
    title,
    description,
    postmedia,
    likes,
    commentscount,
    viewscount,
    author,
}: PostCardProps) {
    return (
        <article className="rounded-lg border border-border p-4 flex flex-col gap-3">
            {postmedia && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={postmedia} alt="" className="rounded-md w-full h-48 object-cover" />
            )}
            <Link href={`/post/${articleid}`} className="font-semibold text-lg hover:underline">
                {title}
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <Link href={`/profile/${author.username}`} className="hover:underline">
                    {author.name}
                </Link>
                <span>
                    {likes} likes · {commentscount} comments · {viewscount} views
                </span>
            </div>
        </article>
    );
}