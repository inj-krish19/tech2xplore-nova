import Link from "next/link";
import { LegalDocument } from "@/components/legal/LegalDocument";

export default function NDAPage() {
    return (
        <LegalDocument title="Mutual NDA" lastUpdated="Draft prepared: August 2026">
            <section>
                <h2>When we use one</h2>
                <p>
                    Before discussing specifics of a potential project — proprietary ideas, unreleased products,
                    internal systems — we sign a mutual NDA. Mutual means it protects both sides: what you share with
                    us, and what we share with you about our own approach and prior work.
                </p>
            </section>

            <section>
                <h2>What it typically covers</h2>
                <ul>
                    <li>Confidential information shared during discovery and scoping</li>
                    <li>A defined confidentiality term (commonly 2-3 years from disclosure)</li>
                    <li>Standard carve-outs — information that was already public, already known to us, or independently developed isn't covered</li>
                    <li>What happens to shared materials if the engagement doesn't move forward</li>
                </ul>
            </section>

            <section>
                <h2>What this page isn't</h2>
                <p>
                    This page describes our NDA process — it isn't itself a signable agreement. The actual NDA is a
                    separate executed document, reviewed by legal counsel, specific to each engagement. If you're
                    ready to discuss a project under NDA, reach out and we'll send the actual document.
                </p>
            </section>

            <section>
                <h2>Get started</h2>
                <p>
                    Ready to discuss something confidential?{" "}
                    <Link href="/contact" className="text-accent hover:underline">
                        Get in touch
                    </Link>{" "}
                    and we'll send over the NDA before the real conversation starts.
                </p>
            </section>
        </LegalDocument>
    );
}