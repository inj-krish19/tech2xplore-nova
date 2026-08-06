import Link from "next/link";
import { LegalDocument } from "@/components/legal/LegalDocument";

export default function DPAPage() {
    return (
        <LegalDocument title="Data Processing Agreement" lastUpdated="Draft prepared: August 2026">
            <section>
                <h2>When this applies</h2>
                <p>
                    If a consulting engagement involves us processing personal data on your behalf — for example,
                    building a system that handles your users' data — and you or your users are covered by a
                    data-protection law like the EU/UK's GDPR or California's CCPA, a Data Processing Agreement (DPA)
                    is signed alongside the service agreement for that engagement.
                </p>
            </section>

            <section>
                <h2>What it typically covers</h2>
                <ul>
                    <li>What categories of personal data we'll process, and for what purpose — scoped to the engagement, nothing broader</li>
                    <li>That we only process data on your documented instructions</li>
                    <li>Confidentiality obligations for anyone on our side with access to the data</li>
                    <li>Security measures appropriate to the data involved</li>
                    <li>Sub-processor disclosure — if any third-party tool touches the data, you're told which one and why</li>
                    <li>What happens to the data at the end of the engagement (deletion or return)</li>
                    <li>How we'd assist with a data-subject request or a breach notification, if one occurs</li>
                </ul>
            </section>

            <section>
                <h2>What this page isn't</h2>
                <p>
                    Same as our NDA and MSA pages — this describes the shape of the agreement, not the agreement
                    itself. The real DPA is a specific, reviewed document, tailored to the actual data involved in
                    your engagement.
                </p>
            </section>

            <section>
                <h2>Get started</h2>
                <p>
                    If your project involves personal data covered by GDPR, CCPA, or a similar law,{" "}
                    <Link href="/contact" className="text-accent hover:underline">
                        mention that when you reach out
                    </Link>{" "}
                    so we scope the DPA alongside the rest of the agreement from the start.
                </p>
            </section>
        </LegalDocument>
    );
}