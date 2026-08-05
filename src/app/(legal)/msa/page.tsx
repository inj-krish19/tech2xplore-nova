import Link from "next/link";
import { LegalDocument } from "@/components/legal/LegalDocument";

export default function MSAPage() {
    return (
        <LegalDocument title="Master Service Agreement" lastUpdated="Draft prepared: August 2026">
            <section>
                <h2>What this covers</h2>
                <p>
                    Every consulting or development engagement — fixed-scope, retainer, or hourly (see our Pricing
                    page for how those differ) — runs under a signed service agreement. This page describes what
                    that agreement typically includes, so you know what to expect before we send the real one.
                </p>
            </section>

            <section>
                <h2>Standard terms</h2>
                <ul>
                    <li>
                        <strong>Scope</strong> — what's included and, just as importantly, what isn't, agreed before
                        work starts
                    </li>
                    <li>
                        <strong>IP assignment</strong> — you own the code and deliverables once paid for in full;
                        this is a standing term, not something negotiated per project
                    </li>
                    <li>
                        <strong>Payment terms</strong> — tied to the engagement model: milestones for fixed-scope,
                        monthly for retainers, invoiced time for hourly
                    </li>
                    <li>
                        <strong>Timeline</strong> — an agreed schedule, with a defined process for handling scope
                        changes that would affect it
                    </li>
                    <li>
                        <strong>Termination</strong> — how either party can end the engagement, and what happens to
                        work in progress and payment for it if that happens
                    </li>
                    <li>
                        <strong>Confidentiality</strong> — carried over from the NDA signed during discovery, extended
                        for the life of the engagement
                    </li>
                </ul>
            </section>

            <section>
                <h2>What this page isn't</h2>
                <p>
                    Like our NDA, this page describes the shape of the agreement — it isn't the agreement itself. The
                    real document is drafted and reviewed for each engagement, with terms specific to that project's
                    scope and model.
                </p>
            </section>

            <section>
                <h2>Get started</h2>
                <p>
                    Ready to scope a project?{" "}
                    <Link href="/contact" className="text-accent hover:underline">
                        Get a quote
                    </Link>{" "}
                    and we'll walk through the agreement together once we're aligned on scope.
                </p>
            </section>
        </LegalDocument>
    );
}