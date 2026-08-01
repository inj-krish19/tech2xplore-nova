import { adminListCommunities } from "@/lib/services/community-service";
import { AdminSearchBar } from "@/components/admin/AdminSearchBar";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminCommunityTable } from "@/components/admin/AdminCommunityTable";

type PageProps = {
    searchParams: Promise<{ page?: string; search?: string }>;
};

export default async function AdminCommunitiesPage({ searchParams }: PageProps) {
    const { page: pageParam, search } = await searchParams;
    const page = Number(pageParam) || 1;
    const pageSize = 10;

    const result = await adminListCommunities(page, pageSize, search);
    const communities = result.items.map((c) => {
        const { _count, ...rest } = c;
        return {
            communityid: rest.communityid.toString(),
            name: rest.name,
            communitydescription: rest.communitydescription,
            memberCount: _count.membership,
        };
    });

    return (
        <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-xl font-semibold">Communities</h1>
                <AdminSearchBar placeholder="Search communities..." />
            </div>
            <AdminCommunityTable communities={communities} />
            <AdminPagination page={result.page} totalPages={result.totalPages} />
        </>
    );
}