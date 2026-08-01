import { adminListCategories } from "@/lib/services/category-service";
import { AdminSearchBar } from "@/components/admin/AdminSearchBar";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminCategoryTable } from "@/components/admin/AdminCategoryTable";

type PageProps = {
    searchParams: Promise<{ page?: string; search?: string }>;
};

export default async function AdminCategoriesPage({ searchParams }: PageProps) {
    const { page: pageParam, search } = await searchParams;
    const page = Number(pageParam) || 1;
    const pageSize = 10;

    const result = await adminListCategories(page, pageSize, search);
    const categories = result.items.map((c) => {
        const { _count, ...rest } = c;
        return {
            categoryid: rest.categoryid.toString(),
            name: rest.name,
            categorydescription: rest.categorydescription,
            postCount: _count.postcategoryassignment,
        };
    });

    return (
        <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-xl font-semibold">Categories</h1>
                <AdminSearchBar placeholder="Search categories..." />
            </div>
            <AdminCategoryTable categories={categories} />
            <AdminPagination page={result.page} totalPages={result.totalPages} />
        </>
    );
}