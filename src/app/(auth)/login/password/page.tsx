import { Suspense } from "react";
import { LoginPasswordForm } from "@/components/auth/LoginPasswordForm";

export default function LoginPasswordPage() {
    return (
        <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4">
            <h1 className="text-2xl font-semibold">Enter your password</h1>
            {/* useSearchParams inside LoginPasswordForm requires a Suspense boundary */}
            <Suspense fallback={null}>
                <LoginPasswordForm />
            </Suspense>
        </div>
    );
}