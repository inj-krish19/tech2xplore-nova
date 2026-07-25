"use client";

import { SessionProvider } from "next-auth/react";
import { SessionSync } from "@/components/auth/SessionSync";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <SessionSync />
            <ThemeProvider />
            {children}
        </SessionProvider>
    );
}