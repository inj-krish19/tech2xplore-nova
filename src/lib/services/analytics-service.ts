import { db } from "@/lib/db";

/**
 * All figures here are current totals/snapshots from existing per-post
 * counters (viewscount, likes, dislikes, commentscount, shares) — there's
 * no "views over time" chart because no time-series data is captured
 * anywhere in the schema (each counter is a single running total,
 * incremented in place, with no historical record of when). A real
 * over-time view would need a separate events/snapshots table, which is
 * a schema change and a bigger lift than this pass — flagging it rather
 * than faking a trend line from a single number.
 */
export async function getBloggerAnalytics(authorId: bigint) {
  const posts = await db.post.findMany({
    where: { primaryauthor: authorId },
    select: {
      articleid: true,
      title: true,
      poststatus: true,
      viewscount: true,
      likes: true,
      dislikes: true,
      commentscount: true,
      shares: true,
      publishedat: true,
    },
  });

  const totals = posts.reduce(
    (acc, p) => ({
      totalViews: acc.totalViews + p.viewscount,
      totalLikes: acc.totalLikes + p.likes,
      totalDislikes: acc.totalDislikes + p.dislikes,
      totalComments: acc.totalComments + p.commentscount,
      totalShares: acc.totalShares + p.shares,
    }),
    { totalViews: 0, totalLikes: 0, totalDislikes: 0, totalComments: 0, totalShares: 0 }
  );

  const publishedCount = posts.filter((p) => p.poststatus === "published").length;
  const draftCount = posts.filter((p) => p.poststatus === "draft").length;

  // "Top posts" ranked by views — the one figure every post has that's
  // directly comparable regardless of age (a like/comment count is more
  // a function of how long a post has been up than a newer post's
  // engagement quality).
  const topPosts = [...posts]
    .sort((a, b) => b.viewscount - a.viewscount)
    .slice(0, 10)
    .map((p) => ({
      articleid: p.articleid.toString(),
      title: p.title,
      poststatus: p.poststatus,
      viewscount: p.viewscount,
      likes: p.likes,
      commentscount: p.commentscount,
      shares: p.shares,
    }));

  return {
    totalPosts: posts.length,
    publishedCount,
    draftCount,
    ...totals,
    topPosts,
  };
}