"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { FiCheckCircle, FiXCircle, FiInfo, FiX, FiLoader } from "react-icons/fi";

export type ToastVariant = "success" | "error" | "info" | "loading";

export type Toast = {
    id: string;
    message: string;
    variant: ToastVariant;
    duration: number;
};

type ToastInput = {
    message: string;
    variant?: ToastVariant;
    /** ms before auto-dismiss. Loading toasts never auto-dismiss unless overridden. */
    duration?: number;
};

type ToastContextValue = {
    toasts: Toast[];
    toast: (input: ToastInput) => string;
    /** Update an existing toast in place — e.g. flip a "loading" toast to "success"/"error". */
    update: (id: string, input: ToastInput) => void;
    dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION: Record<ToastVariant, number> = {
    success: 4000,
    error: 5000,
    info: 4000,
    loading: 0, // no auto-dismiss
};

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    const clearTimer = useCallback((id: string) => {
        const t = timers.current.get(id);
        if (t) {
            clearTimeout(t);
            timers.current.delete(id);
        }
    }, []);

    const dismiss = useCallback(
        (id: string) => {
            clearTimer(id);
            setToasts((prev) => prev.filter((t) => t.id !== id));
        },
        [clearTimer]
    );

    const scheduleAutoDismiss = useCallback(
        (id: string, duration: number) => {
            clearTimer(id);
            if (duration > 0) {
                timers.current.set(
                    id,
                    setTimeout(() => dismiss(id), duration)
                );
            }
        },
        [clearTimer, dismiss]
    );

    const toast = useCallback(
        ({ message, variant = "info", duration }: ToastInput) => {
            const id = crypto.randomUUID();
            const resolvedDuration = duration ?? DEFAULT_DURATION[variant];
            setToasts((prev) => [...prev, { id, message, variant, duration: resolvedDuration }]);
            scheduleAutoDismiss(id, resolvedDuration);
            return id;
        },
        [scheduleAutoDismiss]
    );

    const update = useCallback(
        (id: string, { message, variant = "info", duration }: ToastInput) => {
            const resolvedDuration = duration ?? DEFAULT_DURATION[variant];
            setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, message, variant, duration: resolvedDuration } : t)));
            scheduleAutoDismiss(id, resolvedDuration);
        },
        [scheduleAutoDismiss]
    );

    return (
        <ToastContext.Provider value={{ toasts, toast, update, dismiss }}>
            {children}
            <ToastViewport />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within a ToastProvider");
    return ctx;
}

const VARIANT_ICON: Record<ToastVariant, typeof FiCheckCircle> = {
    success: FiCheckCircle,
    error: FiXCircle,
    info: FiInfo,
    loading: FiLoader,
};

const VARIANT_CLASS: Record<ToastVariant, string> = {
    success: "border-green-500/30 text-green-600 dark:text-green-400",
    error: "border-red-500/30 text-red-600 dark:text-red-400",
    info: "border-border text-foreground",
    loading: "border-border text-foreground",
};

function ToastViewport() {
    const { toasts, dismiss } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div
            role="region"
            aria-label="Notifications"
            className="fixed inset-x-0 bottom-0 z-[100] flex flex-col-reverse items-center gap-2 p-4 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:items-end"
        >
            {toasts.map((t) => {
                const Icon = VARIANT_ICON[t.variant];
                return (
                    <div
                        key={t.id}
                        role="status"
                        className={`flex w-full max-w-sm items-start gap-3 rounded-lg border bg-card px-4 py-3 shadow-lg transition-all duration-200 sm:w-96 ${VARIANT_CLASS[t.variant]}`}
                    >
                        <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${t.variant === "loading" ? "animate-spin" : ""}`} />
                        <p className="flex-1 text-sm text-foreground">{t.message}</p>
                        {t.variant !== "loading" && (
                            <button
                                onClick={() => dismiss(t.id)}
                                aria-label="Dismiss notification"
                                className="shrink-0 text-muted-foreground hover:text-foreground"
                            >
                                <FiX className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}