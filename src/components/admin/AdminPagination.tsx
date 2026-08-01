"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function AdminPagination({ page, totalPages }: { page: number; totalPages: number }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    if (totalPages <= 1) return null;

    const goTo = (target: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(target));
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
            // router.push alone can serve the router cache's existing RSC
            // payload for this pathname — the URL and this component's own
            // `page` prop update, but the server-fetched list underneath
            // doesn't, until a full reload. refresh() forces the re-fetch.
            router.refresh();
        });
    };

    return (
        <div
            className={`flex items-center justify-between pt-4 text-sm text-muted-foreground transition-opacity ${isPending ? "opacity-50" : ""
                }`}
        >
            <button
                type="button"
                disabled={page <= 1 || isPending}
                onClick={() => goTo(page - 1)}
                className="rounded-md px-2 py-1 hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent"
            >
                Previous
            </button>
            <span>{isPending ? "Loading..." : `Page ${page} of ${totalPages}`}</span>
            <button
                type="button"
                disabled={page >= totalPages || isPending}
                onClick={() => goTo(page + 1)}
                className="rounded-md px-2 py-1 hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent"
            >
                Next
            </button>
        </div>
    );
}