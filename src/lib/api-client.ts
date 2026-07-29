/**
 * Thin fetch wrapper aware of api-response.ts's envelope
 * ({success, data} / {success, error}) — unwraps `data` on success and
 * throws the real `error` message on failure, instead of handing callers
 * the whole envelope as if it were the payload itself.
 */
export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (res.status === 204) return undefined as T;

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return undefined as T;
  }

  if (!res.ok) {
    const message =
      (body as { error?: string; message?: string })?.error ??
      (body as { error?: string; message?: string })?.message ??
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  // apiSuccess wraps as { success: true, data }. If a route ever returns
  // a raw payload without that envelope, fall back to the body as-is.
  if (body && typeof body === "object" && "data" in body) {
    return (body as { data: T }).data;
  }
  return body as T;
}