import { LegalDocument } from "@/components/legal/LegalDocument";

export default function TermsOfServicePage() {
    return (
        <LegalDocument title="Terms of Service" lastUpdated="Draft prepared: August 2026">
            <section>
                <h2>Your account</h2>
                <p>
                    You're responsible for the security of your account and everything posted under it. You must be
                    old enough to legally form a contract in your jurisdiction to create an account. Don't
                    impersonate another person or organization.
                </p>
            </section>

            <section>
                <h2>Your content</h2>
                <ul>
                    <li>You own what you post — we don't claim ownership of your articles, comments, or other content</li>
                    <li>
                        By posting, you grant Tech2Xplore a license to display, distribute, and promote that content
                        on the platform (and, where you've explicitly connected LinkedIn sharing, to the destination
                        you chose)
                    </li>
                    <li>You're responsible for making sure you have the right to post what you post</li>
                </ul>
            </section>

            <section>
                <h2>Acceptable use</h2>
                <p>Don't use Tech2Xplore to:</p>
                <ul>
                    <li>Post content that's illegal, harassing, or infringes someone else's rights</li>
                    <li>Spam, scrape, or abuse the platform's systems</li>
                    <li>Attempt to circumvent account suspensions or bans</li>
                </ul>
                <p>See our Acceptable Use Policy (once published) for the fuller version of this.</p>
            </section>

            <section>
                <h2>Moderation and account status</h2>
                <p>
                    We may suspend or ban accounts that violate these terms. A ban prevents further posting and
                    interaction; we aim to communicate the reason where practical. Content you've already posted may
                    remain visible after a ban unless it independently violates policy and is removed.
                </p>
            </section>

            <section>
                <h2>The consulting/services side</h2>
                <p>
                    These Terms cover the platform (posting, accounts, community features). Consulting and
                    development engagements are governed by a separate signed agreement (see our MSA) with terms
                    specific to that project — these Terms don't override or replace that agreement where the two
                    overlap.
                </p>
            </section>

            <section>
                <h2>Termination</h2>
                <p>
                    You can delete your account at any time. We may suspend or terminate accounts that violate these
                    Terms. Either of us can stop using/offering the platform at any time, subject to any separate
                    signed agreement that says otherwise.
                </p>
            </section>

            <section>
                <h2>Disclaimer and liability</h2>
                <p>
                    The platform is provided as-is. We work to keep it reliable but don't guarantee uninterrupted
                    availability. To the extent permitted by law, Tech2Xplore isn't liable for indirect or
                    consequential damages arising from platform use.
                </p>
            </section>

            <section>
                <h2>Changes to these terms</h2>
                <p>
                    We'll update the date at the top of this page when these Terms change, and notify account
                    holders directly for material changes.
                </p>
            </section>

            <section>
                <h2>Contact</h2>
                <p>Questions about these Terms — reach us via the Contact page or at techtoxplore@gmail.com.</p>
            </section>
        </LegalDocument>
    );
}