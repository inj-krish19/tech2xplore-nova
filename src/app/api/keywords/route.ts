import { listKeywords, createKeyword } from "@/lib/services/keyword-service";
import { createKeywordSchema } from "@/lib/validations/keyword";
import { apiSuccess, withErrorHandling } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = withErrorHandling(async () => {
  const keywords = await listKeywords();
  return apiSuccess(keywords.map((k) => ({ ...k, keywordid: k.keywordid.toString() })));
});

export const POST = withErrorHandling(async (req: Request) => {
  await requireAdmin(); // keyword taxonomy is admin-managed, same as categories
  const body = await req.json();
  const input = createKeywordSchema.parse(body);
  const keyword = await createKeyword(input);
  return apiSuccess({ ...keyword, keywordid: keyword.keywordid.toString() }, 201);
});