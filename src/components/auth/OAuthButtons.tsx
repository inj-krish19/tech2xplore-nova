"use client";

import { signIn } from "next-auth/react";
import { FaGoogle, FaLinkedin } from "react-icons/fa";

export function OAuthButtons({ callbackUrl = "/feed" }: { callbackUrl?: string }) {
    return (
        <div className="flex flex-col gap-3">
            <button
                type="button"
                onClick={() => signIn("google", { callbackUrl })}
                className="flex items-center justify-center gap-2 rounded-md border border-border py-2.5 text-sm font-medium hover:bg-muted transition-colors"
            >
                <FaGoogle />
                Continue with Google
            </button>
            <button
                type="button"
                onClick={() => signIn("linkedin", { callbackUrl })}
                className="flex items-center justify-center gap-2 rounded-md border border-border py-2.5 text-sm font-medium hover:bg-muted transition-colors"
            >
                <FaLinkedin />
                Continue with LinkedIn
            </button>
        </div>
    );
}