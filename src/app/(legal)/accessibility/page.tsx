import { LegalDocument } from "@/components/legal/LegalDocument";

export default function AccessibilityStatementPage() {
    return (
        <LegalDocument title="Accessibility Statement" lastUpdated="Draft prepared: August 2026">
            <section>
                <h2>Our commitment</h2>
                <p>
                    We want Tech2Xplore to be usable by as many people as possible, including people using assistive
                    technology. This statement describes where things currently stand — honestly, not aspirationally.
                </p>
            </section>

            <section>
                <h2>Current state</h2>
                <p>
                    Tech2Xplore has not yet completed a formal accessibility audit against a standard like WCAG 2.1.
                    An accessibility pass — focus states, aria labels, color contrast across both the light and dark
                    themes — is a known, tracked item that hasn't been done yet. This statement will be updated with
                    a real conformance level once that audit happens, not before.
                </p>
            </section>

            <section>
                <h2>What we can say today</h2>
                <ul>
                    <li>The platform supports both a light and dark theme, switchable at any time</li>
                    <li>Core navigation and forms are built with semantic HTML elements</li>
                    <li>No formal screen-reader or keyboard-navigation testing has been completed yet</li>
                </ul>
            </section>

            <section>
                <h2>Feedback</h2>
                <p>
                    If you encounter an accessibility barrier using Tech2Xplore, please tell us via the Contact page.
                    Specific, concrete reports (what page, what assistive technology, what happened) are the most
                    useful and the fastest to act on.
                </p>
            </section>
        </LegalDocument>
    );
}