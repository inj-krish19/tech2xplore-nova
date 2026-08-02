import { notFound } from "next/navigation";
import { getOrgPostById } from "@/lib/services/orgpost-service";
import { FaLinkedin } from "react-icons/fa";

export default async function OrgPostDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = await getOrgPostById(BigInt(id)).catch(() => null);
    if (!post) notFound();

    return (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
            {post.coverimage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.coverimage} alt="" className="mb-6 h-64 w-full rounded-xl object-cover" />
            )}
            <h1 className="font-display text-2xl font-semibold">{post.title ?? "Untitled"}</h1>
            {post.publishedat && (
                <p className="mt-2 text-sm text-muted-foreground">
                    {new Date(post.publishedat).toLocaleDateString()}
                </p>
            )}
            {post.content && (
                <div className="prose prose-neutral dark:prose-invert mt-6 max-w-none whitespace-pre-wrap text-sm leading-relaxed">
                    {post.content}
                </div>
            )}

            <div className="flex gap-4">
                <a
                    href={post.sourceurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block text-sm font-medium text-accent hover:opacity-80"
                >
                    View original source &rarr;
                </a>
                <a
                    href={post.linkedinurl || post.sourceurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-row items-center gap-2 mt-6 text-sm font-medium text-accent hover:opacity-80"
                >

                    <FaLinkedin />
                    Continue with LinkedIn
                </a>
            </div>
        </div>
    );
}