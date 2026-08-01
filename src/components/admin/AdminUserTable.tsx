"use client";

import { useEffect, useState } from "react";

export interface AdminUserRow {
    authorid: string;
    name: string;
    username: string;
    email: string;
    bloggerstatus: "active" | "inactive" | "banned";
    authprovider: string;
    createdAt: string;
    postCount: number;
}

const STATUS_STYLES: Record<AdminUserRow["bloggerstatus"], string> = {
    active: "bg-green-500/10 text-green-600",
    inactive: "bg-muted text-muted-foreground",
    banned: "bg-red-500/10 text-red-600",
};

export function AdminUserTable({ users: initial }: { users: AdminUserRow[] }) {
    const [users, setUsers] = useState(initial);

    // Parent re-renders with a fresh initial prop after router.refresh()
    // (pagination/search/status changes) — useState's initial value only
    // applies on mount, so without this the table keeps showing whatever
    // it first mounted with even though the URL and server data moved on.
    useEffect(() => {
        setUsers(initial);
    }, [initial]);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const toggleBan = async (authorid: string, currentStatus: AdminUserRow["bloggerstatus"]) => {
        const nextStatus = currentStatus === "banned" ? "active" : "banned";
        setBusyId(authorid);
        setError(null);
        try {
            const res = await fetch(`/api/admin/users/${authorid}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: nextStatus }),
            });
            const body = await res.json();
            if (!res.ok) {
                setError(body.error ?? "Could not update user status");
                return;
            }
            setUsers((prev) =>
                prev.map((u) => (u.authorid === authorid ? { ...u, bloggerstatus: nextStatus } : u))
            );
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
                        <th className="py-2">Username</th>
                        <th className="py-2">Email</th>
                        <th className="py-2">Provider</th>
                        <th className="py-2">Posts</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.authorid} className="border-b border-border/50">
                            <td className="py-2 font-medium">{u.name}</td>
                            <td className="py-2 text-muted-foreground">@{u.username}</td>
                            <td className="py-2 text-muted-foreground">{u.email}</td>
                            <td className="py-2 text-muted-foreground">{u.authprovider}</td>
                            <td className="py-2">{u.postCount}</td>
                            <td className="py-2">
                                <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLES[u.bloggerstatus]}`}>
                                    {u.bloggerstatus}
                                </span>
                            </td>
                            <td className="py-2">
                                <button
                                    disabled={busyId === u.authorid}
                                    onClick={() => toggleBan(u.authorid, u.bloggerstatus)}
                                    className={`text-xs hover:underline disabled:opacity-50 ${u.bloggerstatus === "banned" ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {u.bloggerstatus === "banned" ? "Unban" : "Ban"}
                                </button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={7} className="py-6 text-center text-muted-foreground">
                                No users found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}