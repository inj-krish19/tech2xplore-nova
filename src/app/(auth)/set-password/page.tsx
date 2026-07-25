import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SetPasswordForm } from "@/components/auth/SetPasswordForm";

export default async function SetPasswordPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4">
            <h1 className="text-2xl font-semibold">Add a password</h1>
            <SetPasswordForm />
        </div>
    );
}