import Link from "next/link";
import { FiBarChart2 } from "react-icons/fi";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getBloggerByUsername } from "@/lib/services/user-service";
import { AvatarPicker } from "@/components/profile/AvatarPicker";
import { SettingsForm } from "@/components/profile/SettingsForm";
import { AVATAR_PRESETS } from "@/lib/constants/avatar-presets";

export default async function SettingsPage() {
    const session = await auth();
    const authorId = (session?.user as { id?: string } | undefined)?.id;
    if (!authorId) redirect("/login");

    const username = (session?.user as { username?: string } | undefined)?.username;
    const blogger = username ? await getBloggerByUsername(username).catch(() => null) : null;
    if (!blogger) redirect("/login");

    return (
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
            <h1 className="font-display text-2xl font-semibold">Settings</h1>

            <Link
                href="/analytics"
                className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-card p-5 hover:border-accent"
            >
                <FiBarChart2 className="h-5 w-5 text-accent" />
                <div>
                    <p className="text-sm font-medium">View your analytics</p>
                    <p className="text-xs text-muted-foreground">Views, likes, comments, and shares across your posts</p>
                </div>
            </Link>

            <div className="mt-6 rounded-xl border border-border bg-card p-5">
                <h2 className="font-display text-base font-semibold">Profile</h2>
                <div className="mt-4">
                    <SettingsForm initialName={blogger.name} initialBio={blogger.bio} />
                </div>
            </div>

            <div className="mt-6 rounded-xl border border-border bg-card p-5">
                <h2 className="font-display text-base font-semibold">Avatar</h2>
                <div className="mt-4">
                    <AvatarPicker currentAvatarUrl={blogger.profilepicture} presets={AVATAR_PRESETS} />
                </div>
            </div>
        </div>
    );
}