import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

/**
 * TEMPORARY admin gate: there's no `role` column on `blogger` yet, only
 * `bloggerstatus` (active/inactive/banned) — that's a different concept.
 * Until a real role/permission column exists, admin access is an env-var
 * allowlist by email. This is a stopgap, not a design decision — flag
 * if/when you want a proper `role` field added to the schema.
 *
 * Moved here from app/admin/page.tsx so every /admin/* route is gated
 * once, in one place, instead of each page re-implementing the same
 * check (and each page re-rendering its own <AdminSidebar>, which is
 * part of why the sidebar wasn't behaving as a fixed shell before).
 */
function isAdminEmail(email: string | null | undefined) {
    if (!email) return false;
    const allowlist = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
    return allowlist.includes(email.toLowerCase());
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=/admin");
    }
    if (!isAdminEmail(session.user.email)) {
        redirect("/feed");
    }

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <main className="min-w-0 flex-1 p-6">{children}</main>
        </div>
    );
}