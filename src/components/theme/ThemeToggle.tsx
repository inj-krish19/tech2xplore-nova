"use client";

import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useThemeStore, resolveTheme } from "@/store/themeStore";

/**
 * Two-state switch, not a cycle button. Theme defaults to "system"
 * (set in themeStore) until the user flips this — from then on it's an
 * explicit light/dark choice. "System" is never something this control
 * sets back to; that's intentional per the product decision.
 */
export function ThemeToggle() {
    const theme = useThemeStore((s) => s.theme);
    const setTheme = useThemeStore((s) => s.setTheme);

    // Avoid hydration mismatch: resolveTheme reads window.matchMedia,
    // which isn't available during SSR.
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const isDark = mounted && resolveTheme(theme) === "dark";

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative inline-flex h-7 w-14 shrink-0 items-center rounded-full border border-border bg-muted transition-colors"
        >
            <span
                className={`absolute left-1 flex h-5 w-5 items-center justify-center rounded-full bg-background shadow-sm transition-transform duration-200 ${isDark ? "translate-x-7" : "translate-x-0"
                    }`}
            >
                {isDark ? (
                    <FiMoon className="h-3 w-3 text-accent" />
                ) : (
                    <FiSun className="h-3 w-3 text-accent" />
                )}
            </span>
        </button>
    );
}