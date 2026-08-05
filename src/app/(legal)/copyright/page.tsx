import { LegalDocument } from "@/components/legal/LegalDocument";

export default function CopyrightPolicyPage() {
    return (
        <LegalDocument title="Copyright & DMCA Policy" lastUpdated="Draft prepared: August 2026">
            <section>
                <h2>Respecting copyright</h2>
                <p>
                    Tech2Xplore hosts user-generated content — articles, comments, and community posts written by
                    our users. We expect users to only post content they have the right to post, and we respond to
                    valid claims that content infringes someone else's copyright.
                </p>
            </section>

            <section>
                <h2>Filing a takedown notice</h2>
                <p>To report content you believe infringes your copyright, send us the following:</p>
                <ul>
                    <li>A description of the copyrighted work you claim is being infringed</li>
                    <li>A link to the specific content on Tech2Xplore</li>
                    <li>Your contact information</li>
                    <li>A statement that you have a good-faith belief the use isn't authorized</li>
                    <li>A statement, under penalty of perjury, that the information you've provided is accurate and that you're the copyright owner or authorized to act on their behalf</li>
                    <li>Your physical or electronic signature</li>
                </ul>
                <p>Send this to us via the Contact page or techtoxplore@gmail.com.</p>
            </section>

            <section>
                <h2>What happens next</h2>
                <p>
                    We review the notice and, if valid, remove or disable access to the content and notify the
                    poster. The poster may submit a counter-notice if they believe the content was removed in error;
                    standard DMCA counter-notice procedure applies.
                </p>
            </section>

            <section>
                <h2>Repeat infringers</h2>
                <p>
                    Accounts with a pattern of confirmed copyright violations may be suspended or banned, consistent
                    with our Acceptable Use Policy.
                </p>
            </section>

            <section>
                <h2>Note on jurisdiction</h2>
                <p>
                    This page is written with the U.S. DMCA process as a reference point since it's the most common
                    framework referenced for this kind of policy — the actual applicable law depends on where
                    Tech2Xplore is legally established and where a given user is located. Confirm the right framework
                    with legal counsel before treating this as final.
                </p>
            </section>
        </LegalDocument>
    );
}