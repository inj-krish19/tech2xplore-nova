import { adminListUsers } from "@/lib/services/user-service";
import { AdminSearchBar } from "@/components/admin/AdminSearchBar";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminUserTable } from "@/components/admin/AdminUserTable";

type PageProps = {
    searchParams: Promise<{ page?: string; search?: string }>;
};

export default async function AdminUsersPage({ searchParams }: PageProps) {
    const { page: pageParam, search } = await searchParams;
    const page = Number(pageParam) || 1;
    const pageSize = 10;

    const result = await adminListUsers(page, pageSize, search);
    const users = result.items.map((u) => {
        const { _count, ...rest } = u;
        return {
            authorid: rest.authorid.toString(),
            name: rest.name,
            username: rest.username,
            email: rest.email,
            bloggerstatus: rest.bloggerstatus ?? "active",
            authprovider: rest.authprovider ?? "credentials",
            createdAt: (rest.createdat ?? new Date()).toISOString(),
            postCount: _count.post,
        };
    });

    return (
        <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-xl font-semibold">Users</h1>
                <AdminSearchBar placeholder="Search name, username, or email..." />
            </div>
            <AdminUserTable users={users} />
            <AdminPagination page={result.page} totalPages={result.totalPages} />
        </>
    );
}