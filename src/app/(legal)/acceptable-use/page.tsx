import { LegalDocument } from "@/components/legal/LegalDocument";

export default function AcceptableUsePage() {
    return (
        <LegalDocument title="Acceptable Use Policy" lastUpdated="Draft prepared: August 2026">
            <section>
                <h2>Purpose</h2>
                <p>
                    This expands on the acceptable-use section of our Terms of Service, specifically for the
                    Tech2Xplore platform (posts, comments, communities). It exists to keep the platform usable for
                    everyone, not to be exhaustive — content that isn't explicitly listed can still violate this
                    policy if it's clearly harmful.
                </p>
            </section>

            <section>
                <h2>Not allowed</h2>
                <ul>
                    <li>Illegal content, or content that facilitates illegal activity</li>
                    <li>Harassment, threats, or targeted abuse of other users</li>
                    <li>Hate speech or content that promotes discrimination against a protected group</li>
                    <li>Spam — repetitive, low-value posts, or content designed purely to game engagement metrics</li>
                    <li>Impersonation of another person, brand, or organization</li>
                    <li>Malware, phishing links, or content designed to compromise another user's account or device</li>
                    <li>Scraping the platform at scale, or automated account creation</li>
                    <li>Circumventing a suspension or ban by creating a new account</li>
                </ul>
            </section>

            <section>
                <h2>Community-specific rules</h2>
                <p>
                    Individual communities may set additional rules for their own space, enforced by that
                    community's admins (see the membership roles in Communities). Community-level rules can't
                    override this platform-wide policy — they can only add stricter norms on top of it.
                </p>
            </section>

            <section>
                <h2>Enforcement</h2>
                <p>
                    Violations may result in content removal, a warning, a temporary suspension, or a permanent ban,
                    depending on severity — see the moderation section of our Terms of Service. We aim to be
                    proportionate: a first-time minor issue is treated differently from a deliberate, repeated one.
                </p>
            </section>

            <section>
                <h2>Reporting</h2>
                <p>
                    If you see content that violates this policy, reach us via the Contact page. Include a link to
                    the content and a brief description of the issue.
                </p>
            </section>
        </LegalDocument>
    );
}