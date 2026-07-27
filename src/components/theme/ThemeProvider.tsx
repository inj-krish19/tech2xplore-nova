"use client";

import { ReactNode, useEffect, useState } from "react";
import { useThemeStore, resolveTheme } from "@/store/themeStore";

/** Mount once near the root layout. Renders nothing; just applies the class. */
export function ThemeProvider({ children }: { children: ReactNode }) {
    const theme = useThemeStore((s) => s.theme);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!mounted) return;
        const resolved = resolveTheme(theme);
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(resolved);
    }, [theme, mounted]);

    useEffect(() => {
        if (theme !== "system") return;
        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = () => {
            document.documentElement.classList.remove("light", "dark");
            document.documentElement.classList.add(mql.matches ? "dark" : "light");
        };
        mql.addEventListener("change", onChange);
        return () => mql.removeEventListener("change", onChange);
    }, [theme]);

    return null;
}