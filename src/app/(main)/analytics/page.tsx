import { redirect } from "next/navigation";
import Link from "next/link";
import { FiEye, FiHeart, FiMessageCircle, FiShare2 } from "react-icons/fi";
import { auth } from "@/lib/auth";
import { getBloggerAnalytics } from "@/lib/services/analytics-service";

const STAT_CARDS = [
    { key: "totalViews" as const, label: "Total views", icon: FiEye },
    { key: "totalLikes" as const, label: "Total likes", icon: FiHeart },
    { key: "totalComments" as const, label: "Total comments", icon: FiMessageCircle },
    { key: "totalShares" as const, label: "Total shares", icon: FiShare2 },
];

export default async function AnalyticsPage() {
    const session = await auth();
    const authorId = (session?.user as { id?: string } | undefined)?.id;
    if (!authorId) redirect("/login");

    const analytics = await getBloggerAnalytics(BigInt(authorId));

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
            <h1 className="font-display text-2xl font-semibold">Analytics</h1>
            <p className="mt-1 text-sm text-muted-foreground">
                {analytics.totalPosts} posts total — {analytics.publishedCount} published, {analytics.draftCount} draft.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {STAT_CARDS.map((card) => (
                    <div key={card.key} className="rounded-xl border border-border bg-card p-5">
                        <card.icon className="h-4 w-4 text-accent" />
                        <p className="mt-2 font-display text-2xl font-semibold">{analytics[card.key]}</p>
                        <p className="text-xs text-muted-foreground">{card.label}</p>
                    </div>
                ))}
            </div>

            <div className="mt-10">
                <p className="font-mono-kicker text-muted-foreground">Top posts by views</p>
                {analytics.topPosts.length === 0 ? (
                    <p className="mt-3 text-sm text-muted-foreground">Nothing published yet.</p>
                ) : (
                    <div className="mt-3 overflow-hidden rounded-xl border border-border">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-card text-left text-muted-foreground">
                                    <th className="px-4 py-2.5">Post</th>
                                    <th className="px-4 py-2.5">Status</th>
                                    <th className="px-4 py-2.5">Views</th>
                                    <th className="px-4 py-2.5">Likes</th>
                                    <th className="px-4 py-2.5">Comments</th>
                                    <th className="px-4 py-2.5">Shares</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.topPosts.map((post) => (
                                    <tr key={post.articleid} className="border-b border-border/50 last:border-0">
                                        <td className="max-w-xs truncate px-4 py-2.5 font-medium">
                                            <Link href={`/post/${post.articleid}`} className="hover:text-accent">
                                                {post.title}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-2.5 capitalize text-muted-foreground">{post.poststatus}</td>
                                        <td className="px-4 py-2.5">{post.viewscount}</td>
                                        <td className="px-4 py-2.5">{post.likes}</td>
                                        <td className="px-4 py-2.5">{post.commentscount}</td>
                                        <td className="px-4 py-2.5">{post.shares}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
                Figures are current totals, not trends over time — there's no historical snapshot data captured yet
                to chart change over a date range.
            </p>
        </div>
    );
}