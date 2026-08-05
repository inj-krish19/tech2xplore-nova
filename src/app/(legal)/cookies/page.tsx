import { LegalDocument } from "@/components/legal/LegalDocument";

export default function CookiePolicyPage() {
    return (
        <LegalDocument title="Cookie Policy" lastUpdated="Draft prepared: August 2026">
            <section>
                <h2>What we actually use</h2>
                <p>
                    Tech2Xplore uses one strictly necessary cookie: a session cookie (a signed JSON Web Token) that
                    keeps you signed in after login, valid for up to 30 days or until you sign out. Without it,
                    you'd need to sign in again on every visit.
                </p>
            </section>

            <section>
                <h2>What we don't use</h2>
                <ul>
                    <li>No advertising or third-party tracking cookies</li>
                    <li>No cross-site behavioral tracking</li>
                    <li>No analytics cookies at the time of this draft</li>
                </ul>
                <p>
                    Your theme preference (light/dark) is stored in your browser's local storage, not a cookie — it
                    stays on your device and isn't sent to our servers.
                </p>
            </section>

            <section>
                <h2>Third-party sign-in</h2>
                <p>
                    If you sign in with Google or LinkedIn, those providers may set their own cookies during the
                    sign-in flow, governed by their own cookie policies — not this one.
                </p>
            </section>

            <section>
                <h2>Managing cookies</h2>
                <p>
                    Because our session cookie is strictly necessary for the platform to function, blocking it means
                    you won't be able to stay signed in. Most browsers let you clear cookies for this site
                    specifically if you'd like to sign out everywhere at once.
                </p>
            </section>

            <section>
                <h2>Changes to this policy</h2>
                <p>
                    If we add analytics or other non-essential cookies in the future, this page will be updated
                    first, and a consent mechanism added where required by law.
                </p>
            </section>
        </LegalDocument>
    );
}