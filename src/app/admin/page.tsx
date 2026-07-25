import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { PostModerationTable } from "@/components/admin/PostModerationTable";

/**
 * TEMPORARY admin gate: there's no `role` column on `blogger` yet, only
 * `bloggerstatus` (active/inactive/banned) — that's a different concept.
 * Until a real role/permission column exists, admin access is an env-var
 * allowlist by email. This is a stopgap, not a design decision — flag
 * if/when you want a proper `role` field added to the schema.
 */
function isAdminEmail(email: string | null | undefined) {
    if (!email) return false;
    const allowlist = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
    return allowlist.includes(email.toLowerCase());
}

export default async function AdminPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=/admin");
    }
    if (!isAdminEmail(session.user.email)) {
        redirect("/feed");
    }

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
        <div className="flex min-h-screen">
            <AdminSidebar />
            <main className="flex-1 p-6">
                <h1 className="mb-6 text-xl font-semibold">Moderation — recent posts</h1>
                <PostModerationTable posts={moderationPosts} />
            </main>
        </div>
    );
}