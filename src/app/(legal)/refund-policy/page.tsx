import { LegalDocument } from "@/components/legal/LegalDocument";

export default function RefundPolicyPage() {
    return (
        <LegalDocument title="Refund & Cancellation Policy" lastUpdated="Draft prepared: August 2026">
            <section>
                <h2>How this varies by engagement model</h2>
                <p>
                    Refund and cancellation terms depend on which engagement model applies — see our Pricing page for
                    how Fixed-Scope, Retainer, and Hourly Consulting differ. The general principles below apply
                    across all three; the actual numbers (notice periods, refund percentages) are set in the signed
                    service agreement for each engagement, not fixed here.
                </p>
            </section>

            <section>
                <h2>Fixed-scope projects</h2>
                <ul>
                    <li>Payments are typically tied to milestones — you're only billed for work as it's delivered</li>
                    <li>Cancelling before a milestone is delivered means that milestone isn't billed</li>
                    <li>Work delivered and accepted before cancellation is non-refundable</li>
                </ul>
            </section>

            <section>
                <h2>Retainers</h2>
                <ul>
                    <li>Billed monthly in advance</li>
                    <li>Cancelling ends the retainer at the end of the current billing period — no partial-month refund for unused time, since capacity is reserved in advance</li>
                    <li>A minimum notice period (defined in the signed agreement) typically applies before cancellation takes effect</li>
                </ul>
            </section>

            <section>
                <h2>Hourly consulting</h2>
                <ul>
                    <li>Billed for actual time spent — nothing to refund beyond correcting a billing error</li>
                    <li>No minimum commitment, so cancellation just means no further hours are booked</li>
                </ul>
            </section>

            <section>
                <h2>Disputes</h2>
                <p>
                    If you believe you were billed incorrectly, contact us before disputing the charge with your
                    bank/card provider — most billing issues are resolved faster that way.
                </p>
            </section>

            <section>
                <h2>Contact</h2>
                <p>Billing questions — reach us via the Contact page or at techtoxplore@gmail.com.</p>
            </section>
        </LegalDocument>
    );
}