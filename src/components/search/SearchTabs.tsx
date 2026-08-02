"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const TABS: { value: "posts" | "people" | "communities"; label: string }[] = [
    { value: "posts", label: "Posts" },
    { value: "people", label: "People" },
    { value: "communities", label: "Communities" },
];

export function SearchTabs({ activeType }: { activeType: "posts" | "people" | "communities" }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const goTo = (type: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("type", type);
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
        router.refresh();
    };

    return (
        <div className="flex gap-1 rounded-md border border-border bg-card p-1">
            {TABS.map((tab) => (
                <button
                    key={tab.value}
                    type="button"
                    onClick={() => goTo(tab.value)}
                    className={`rounded px-3 py-1.5 text-sm ${activeType === tab.value
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted"
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}