"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface AdminCategoryRow {
    categoryid: string;
    name: string;
    categorydescription: string;
    postCount: number;
}

export function AdminCategoryTable({ categories: initial }: { categories: AdminCategoryRow[] }) {
    const router = useRouter();
    const [categories, setCategories] = useState(initial);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const remove = async (id: string) => {
        if (!confirm("Delete this category permanently?")) return;
        setBusyId(id);
        setError(null);
        try {
            const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
            const body = await res.json();
            if (!res.ok) {
                setError(body.error ?? "Could not delete category");
                return;
            }
            setCategories((prev) => prev.filter((c) => c.categoryid !== id));
            router.refresh();
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="space-y-3">
            {error && (
                <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-600">{error}</p>
            )}
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                        <th className="py-2">Name</th>
                        <th className="py-2">Description</th>
                        <th className="py-2">Posts</th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((c) => (
                        <tr key={c.categoryid} className="border-b border-border/50">
                            <td className="py-2 font-medium">{c.name}</td>
                            <td className="max-w-md truncate py-2 text-muted-foreground">{c.categorydescription}</td>
                            <td className="py-2">{c.postCount}</td>
                            <td className="py-2">
                                <button
                                    disabled={busyId === c.categoryid}
                                    onClick={() => remove(c.categoryid)}
                                    className="text-xs text-red-600 hover:underline disabled:opacity-50"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {categories.length === 0 && (
                        <tr>
                            <td colSpan={4} className="py-6 text-center text-muted-foreground">
                                No categories found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}