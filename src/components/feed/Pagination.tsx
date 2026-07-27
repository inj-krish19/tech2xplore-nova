"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    function goTo(target: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(target));
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="mt-8 flex items-center justify-center gap-2">
            <button
                onClick={() => goTo(page - 1)}
                disabled={page <= 1}
                aria-label="Previous page"
                className="flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm disabled:opacity-40"
            >
                <FiChevronLeft className="h-4 w-4" />
            </button>

            <span className="px-2 text-sm text-muted-foreground">
                Page {page} of {totalPages}
            </span>

            <button
                onClick={() => goTo(page + 1)}
                disabled={page >= totalPages}
                aria-label="Next page"
                className="flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm disabled:opacity-40"
            >
                <FiChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
}