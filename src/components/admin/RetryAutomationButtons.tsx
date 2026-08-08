"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PROVIDERS = ["gnews", "newsapi", "nytimes", "mediastack"] as const;

export function RetryAutomationButtons() {
    const router = useRouter();
    const [busy, setBusy] = useState<string | null>(null);
    const [result, setResult] = useState<{ provider: string; ok: boolean; message: string } | null>(null);

    const trigger = async (provider: string) => {
        setBusy(provider);
        setResult(null);
        try {
            const res = await fetch(`/api/admin/orgposts/retry/${provider}`, { method: "POST" });
            const body = await res.json();
            if (!res.ok) {
                setResult({ provider, ok: false, message: body.error ?? "Failed" });
                return;
            }
            setResult({ provider, ok: true, message: "Posted successfully" });
            router.refresh();
        } catch {
            setResult({ provider, ok: false, message: "Request failed" });
        } finally {
            setBusy(null);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
                {PROVIDERS.map((provider) => (
                    <button
                        key={provider}
                        disabled={busy !== null}
                        onClick={() => trigger(provider)}
                        className="rounded-md border border-border px-3 py-1.5 text-xs font-medium capitalize hover:bg-muted disabled:opacity-50"
                    >
                        {busy === provider ? "Running..." : `Run ${provider}`}
                    </button>
                ))}
            </div>
            {result && (
                <p className={`text-xs ${result.ok ? "text-green-600" : "text-red-600"}`}>
                    {result.provider}: {result.message}
                </p>
            )}
        </div>
    );
}