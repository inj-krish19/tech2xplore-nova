"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/authStore";

/** Mount once near the root layout, inside <SessionProvider>. */
export function SessionSync() {
    const { data: session, status } = useSession();
    const setUser = useAuthStore((s) => s.setUser);
    const setStatus = useAuthStore((s) => s.setStatus);

    useEffect(() => {
        setStatus(status);
        setUser(
            session?.user
                ? {
                    id: session.user.id,
                    name: session.user.name ?? "",
                    email: session.user.email ?? "",
                    username: session.user.username,
                    image: session.user.image,
                }
                : null
        );
    }, [session, status, setUser, setStatus]);

    return null;
}