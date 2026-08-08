import { adminListOrgPosts } from "@/lib/services/orgpost-service";
import { AdminSearchBar } from "@/components/admin/AdminSearchBar";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminOrgPostTable } from "@/components/admin/AdminOrgPostTable";
import { RetryAutomationButtons } from "@/components/admin/RetryAutomationButtons";

type PageProps = {
    searchParams: Promise<{ page?: string; search?: string }>;
};

export default async function AdminOrgPostsPage({ searchParams }: PageProps) {
    const { page: pageParam, search } = await searchParams;
    const page = Number(pageParam) || 1;
    const pageSize = 10;

    const result = await adminListOrgPosts(page, pageSize, search);
    const orgPosts = result.items.map((p) => ({
        orgpostid: p.orgpostid.toString(),
        title: p.title,
        provider: p.provider,
        linkedinurl: p.linkedinurl,
        publishedat: p.publishedat ? p.publishedat.toISOString() : null,
    }));

    return (
        <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-xl font-semibold">Org Posts</h1>
                <AdminSearchBar placeholder="Search title or provider..." />
            </div>

            <div className="mb-6 rounded-md border border-border bg-card p-4">
                <p className="mb-3 text-sm font-medium">Manually trigger a run</p>
                <RetryAutomationButtons />
            </div>

            <AdminOrgPostTable orgPosts={orgPosts} />
            <AdminPagination page={result.page} totalPages={result.totalPages} />
        </>
    );
}