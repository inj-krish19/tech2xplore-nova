export default function VerifyEmailPage() {
    return (
        <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-4 text-center">
            <h1 className="text-2xl font-semibold">Check your email</h1>
            <p className="text-sm text-muted-foreground">
                We sent a verification link — it expires in 10 minutes. Clicking it takes you straight to
                the login page once it succeeds.
            </p>
        </div>
    );
}