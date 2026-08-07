import { adminListOrgPosts } from "@/lib/services/orgpost-service";
import { apiSuccess, withErrorHandling } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = withErrorHandling(async (req: Request) => {
  await requireAdmin();
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Math.min(Number(searchParams.get("pageSize")) || 10, 50);
  const search = searchParams.get("search") ?? undefined;

  const result = await adminListOrgPosts(page, pageSize, search);

  return apiSuccess({
    ...result,
    items: result.items.map((p) => ({ ...p, orgpostid: p.orgpostid.toString() })),
  });
});