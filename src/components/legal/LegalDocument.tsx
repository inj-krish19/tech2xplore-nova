import { FiAlertTriangle } from "react-icons/fi";

/**
 * Every legal page renders through this — the draft disclaimer is
 * structural, not something each page remembers to add individually.
 * Remove the disclaimer block only after actual legal review, and only
 * per-document (a page can graduate out of draft status independently
 * of the others).
 */
export function LegalDocument({
    title,
    lastUpdated,
    children,
}: {
    title: string;
    lastUpdated: string;
    children: React.ReactNode;
}) {
    return (
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
            <p className="font-mono-kicker text-muted-foreground">Legal</p>
            <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{lastUpdated}</p>

            <div className="mt-6 flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                <FiAlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <p className="text-sm text-amber-600">
                    This is a draft, prepared as a starting point and not yet reviewed by a lawyer. It is not binding
                    and should not be relied on as an actual legal document until reviewed and published.
                </p>
            </div>

            <div className="prose-legal mt-10 flex flex-col gap-6 text-sm text-muted-foreground [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:leading-relaxed [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-5">
                {children}
            </div>
        </div>
    );
}