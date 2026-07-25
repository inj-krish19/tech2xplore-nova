import { auth } from "@/lib/auth";
import { setPasswordSchema } from "@/lib/validations/auth";
import { setPasswordForUser } from "@/lib/services/auth-service";
import { apiSuccess, apiError, withErrorHandling } from "@/lib/api-response";

export const POST = withErrorHandling(async (req: Request) => {
  const session = await auth();
  if (!session?.user?.id) {
    return apiError("You must be signed in to set a password", 401);
  }

  const body = await req.json();
  const { password } = setPasswordSchema.parse(body);

  await setPasswordForUser(BigInt(session.user.id), password);

  return apiSuccess({ message: "Password set — you can now log in with your email too." });
});