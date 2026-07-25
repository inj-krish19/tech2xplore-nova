import { EmailStepForm } from "@/components/auth/EmailStepForm";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

/**
 * Auth.js redirects any sign-in failure (OAuth denial, callback errors,
 * banned account via our signIn callback returning false, etc.) to
 * pages.error = "/login" with ?error=<code>. These are Auth.js's own
 * error codes — previously none of them were ever displayed, so a
 * failed OAuth login just silently landed back on /login with no
 * explanation.
 */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
    OAuthSignin: "Couldn't start the sign-in with that provider — try again.",
    OAuthCallback: "Something went wrong finishing sign-in with that provider — try again.",
    OAuthCreateAccount: "Couldn't create an account from that provider — try again or use email.",
    EmailCreateAccount: "Couldn't create an account with that email.",
    Callback: "Sign-in didn't complete — try again.",
    OAuthAccountNotLinked:
        "That email is already registered a different way — log in with your original method.",
    CredentialsSignin: "Incorrect email or password.",
    AccessDenied: "Access denied — this account may be banned or the sign-in was cancelled.",
    Configuration: "Sign-in is misconfigured on our end — this isn't something you did wrong.",
    Default: "Something went wrong signing you in — try again.",
};

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ info?: string; email?: string; verified?: string; error?: string }>;
}) {
    const params = await searchParams;
    const authErrorMessage = params.error
        ? AUTH_ERROR_MESSAGES[params.error] ?? AUTH_ERROR_MESSAGES.Default
        : null;

    return (
        <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4">
            <h1 className="text-2xl font-semibold">Log in to Tech2Xplore</h1>

            {params.verified === "true" && (
                <p className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
                    Email verified — you can log in now.
                </p>
            )}

            {params.info === "already_registered" && (
                <p className="rounded-md bg-muted p-3 text-sm">
                    That account already exists — log in below.
                </p>
            )}

            {params.error === "missing_token" && (
                <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    Invalid verification link.
                </p>
            )}

            {/* Generic Auth.js error codes (OAuth failure, banned account, etc.) —
          "missing_token" above is our own custom code and takes priority
          if both were somehow present. */}
            {authErrorMessage && params.error !== "missing_token" && (
                <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {authErrorMessage}
                </p>
            )}

            {params.info === "oauth_only" && (
                <p className="rounded-md bg-muted p-3 text-sm">
                    {params.email} signed up with Google or LinkedIn — continue with that provider below to
                    sign in.
                </p>
            )}

            <EmailStepForm />

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="h-px flex-1 bg-border" />
                or
                <div className="h-px flex-1 bg-border" />
            </div>

            <OAuthButtons callbackUrl="/feed" />
        </div>
    );
}