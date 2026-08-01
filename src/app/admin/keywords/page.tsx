import { adminListKeywords } from "@/lib/services/keyword-service";
import { AdminSearchBar } from "@/components/admin/AdminSearchBar";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminKeywordTable } from "@/components/admin/AdminKeywordTable";

type PageProps = {
    searchParams: Promise<{ page?: string; search?: string }>;
};

export default async function AdminKeywordsPage({ searchParams }: PageProps) {
    const { page: pageParam, search } = await searchParams;
    const page = Number(pageParam) || 1;
    const pageSize = 10;

    const result = await adminListKeywords(page, pageSize, search);
    const keywords = result.items.map((k) => {
        const { _count, ...rest } = k;
        return {
            keywordid: rest.keywordid.toString(),
            name: rest.name,
            keyworddescription: rest.keyworddescription,
            postCount: _count.keywordassignment,
        };
    });

    return (
        <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-xl font-semibold">Keywords</h1>
                <AdminSearchBar placeholder="Search keywords..." />
            </div>
            <AdminKeywordTable keywords={keywords} />
            <AdminPagination page={result.page} totalPages={result.totalPages} />
        </>
    );
}