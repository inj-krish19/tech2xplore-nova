import { LegalDocument } from "@/components/legal/LegalDocument";

export default function PrivacyPolicyPage() {
    return (
        <LegalDocument title="Privacy Policy" lastUpdated="Draft prepared: August 2026">
            <section>
                <h2>What we collect</h2>
                <p>When you create a Tech2Xplore account, we collect:</p>
                <ul>
                    <li>Your name, email address, and a username</li>
                    <li>A profile picture, either uploaded or chosen from a preset</li>
                    <li>Content you post — articles, comments, reactions, community memberships</li>
                    <li>
                        If you sign in with Google or LinkedIn, the basic profile information those providers share
                        with us (name, email, profile photo) — we don't receive your password for those accounts
                    </li>
                    <li>
                        If you connect a LinkedIn account for sharing posts, an access token we use only to publish
                        content you explicitly choose to share
                    </li>
                </ul>
            </section>

            <section>
                <h2>How we use it</h2>
                <ul>
                    <li>To operate your account and display your content on the platform</li>
                    <li>To let other users follow you, comment on your posts, and interact within communities</li>
                    <li>To send account-related email (verification, password setup) — never marketing without consent</li>
                    <li>To enforce our Terms of Service, including account suspension for violations</li>
                </ul>
            </section>

            <section>
                <h2>Cookies</h2>
                <p>
                    We use a single session cookie to keep you signed in (a JSON Web Token, valid for up to 30 days).
                    We don't use third-party advertising or tracking cookies. See our Cookie Policy for details.
                </p>
            </section>

            <section>
                <h2>What we don't do</h2>
                <ul>
                    <li>We don't sell your personal information to anyone</li>
                    <li>We don't share your data with advertisers</li>
                    <li>We don't use your content or data to train third-party AI models without telling you first</li>
                </ul>
            </section>

            <section>
                <h2>Your rights</h2>
                <p>
                    You can update your profile information at any time from your account settings. You can request
                    deletion of your account and associated data by contacting us — see the Contact page. If you're
                    located somewhere with specific data-protection rights (such as the EU/UK's GDPR or California's
                    CCPA), those rights apply to you and we'll honor requests made under them.
                </p>
            </section>

            <section>
                <h2>Changes to this policy</h2>
                <p>
                    If this policy changes materially, we'll update the date at the top of this page and, where
                    required, notify account holders directly.
                </p>
            </section>

            <section>
                <h2>Contact</h2>
                <p>Questions about this policy — reach us via the Contact page or at techtoxplore@gmail.com.</p>
            </section>
        </LegalDocument>
    );
}