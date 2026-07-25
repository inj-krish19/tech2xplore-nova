import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

export default async function RegisterPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const params = await searchParams;
    return (
        <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4">
            <h1 className="text-2xl font-semibold">Create your account</h1>

            {params.error === "link_expired" && (
                <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    Your verification link expired (10 minute limit) — submit the form again for a new one.
                </p>
            )}

            <Suspense fallback={null}>
                <RegisterForm />
            </Suspense>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="h-px flex-1 bg-border" />
                or
                <div className="h-px flex-1 bg-border" />
            </div>

            <OAuthButtons callbackUrl="/feed" />
        </div>
    );
}