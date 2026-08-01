import { listPosts } from "@/lib/services/post-service";
import { AdminSearchBar } from "@/components/admin/AdminSearchBar";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminStatusFilter } from "@/components/admin/AdminStatusFilter";
import { PostModerationTable } from "@/components/admin/PostModerationTable";

type PageProps = {
    searchParams: Promise<{ page?: string; search?: string; status?: "draft" | "published" | "archived" }>;
};

export default async function AdminPostsPage({ searchParams }: PageProps) {
    const { page: pageParam, search, status } = await searchParams;
    const page = Number(pageParam) || 1;
    const pageSize = 10;

    const result = await listPosts({ page, pageSize, search, status });
    const posts = result.items.map((p) => ({
        id: p.articleid.toString(),
        title: p.title,
        authorUsername: p.blogger.username,
        status: p.poststatus ?? "draft",
        createdAt: (p.createdat ?? new Date()).toISOString(),
    }));

    return (
        <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-xl font-semibold">Posts</h1>
                <div className="flex items-center gap-3">
                    <AdminStatusFilter />
                    <AdminSearchBar placeholder="Search posts..." />
                </div>
            </div>
            <PostModerationTable posts={posts} />
            <AdminPagination page={result.page} totalPages={result.totalPages} />
        </>
    );
}