"use client";

import { useState, type SubmitEvent } from "react";

const PROJECT_TYPES = ["Web/software development", "Consulting", "Digital marketing", "Platform promotion", "Something else"];
const BUDGET_RANGES = ["Not sure yet", "Under $2k", "$2k–$10k", "$10k–$50k", "$50k+", "Ongoing retainer"];
const TIMELINES = ["ASAP", "Within a month", "1–3 months", "3+ months", "Just exploring"];

export function ContactForm() {
    const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const submit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("submitting");
        setErrorMessage(null);

        const form = new FormData(e.currentTarget);
        const payload = {
            name: form.get("name"),
            email: form.get("email"),
            projectType: form.get("projectType"),
            budgetRange: form.get("budgetRange"),
            timeline: form.get("timeline"),
            message: form.get("message"),
        };

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const body = await res.json();

            if (!res.ok) {
                setErrorMessage(body.error ?? "Something went wrong — please try again.");
                setStatus("error");
                return;
            }

            setStatus("sent");
        } catch (err) {
            console.log(err);
            setErrorMessage("Something went wrong — please try again.");
            setStatus("error");
        }
    };

    if (status === "sent") {
        return (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
                <p className="font-display text-lg font-semibold">Thanks — we got it.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                    We'll get back to you within a couple of business days.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-sm">
                    Name
                    <input
                        name="name"
                        required
                        maxLength={100}
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                    />
                </label>
                <label className="flex flex-col gap-1.5 text-sm">
                    Email
                    <input
                        type="email"
                        name="email"
                        required
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                    />
                </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
                <label className="flex flex-col gap-1.5 text-sm">
                    Project type
                    <select
                        name="projectType"
                        required
                        defaultValue=""
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                    >
                        <option value="" disabled>
                            Select...
                        </option>
                        {PROJECT_TYPES.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex flex-col gap-1.5 text-sm">
                    Budget range
                    <select
                        name="budgetRange"
                        required
                        defaultValue=""
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                    >
                        <option value="" disabled>
                            Select...
                        </option>
                        {BUDGET_RANGES.map((b) => (
                            <option key={b} value={b}>
                                {b}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex flex-col gap-1.5 text-sm">
                    Timeline
                    <select
                        name="timeline"
                        required
                        defaultValue=""
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                    >
                        <option value="" disabled>
                            Select...
                        </option>
                        {TIMELINES.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <label className="flex flex-col gap-1.5 text-sm">
                What are you working on?
                <textarea
                    name="message"
                    required
                    minLength={10}
                    rows={5}
                    className="resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                />
            </label>

            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

            <button
                type="submit"
                disabled={status === "submitting"}
                className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
            >
                {status === "submitting" ? "Sending..." : "Send"}
            </button>
        </form>
    );
}