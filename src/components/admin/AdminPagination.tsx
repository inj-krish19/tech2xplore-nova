"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function AdminPagination({ page, totalPages }: { page: number; totalPages: number }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    const goTo = (target: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(target));
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center justify-between pt-4 text-sm text-muted-foreground">
            <button
                type="button"
                disabled={page <= 1}
                onClick={() => goTo(page - 1)}
                className="rounded-md px-2 py-1 hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent"
            >
                Previous
            </button>
            <span>
                Page {page} of {totalPages}
            </span>
            <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => goTo(page + 1)}
                className="rounded-md px-2 py-1 hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent"
            >
                Next
            </button>
        </div>
    );
}