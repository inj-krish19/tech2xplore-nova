/** Thin fetch wrapper — throws with the API's error message on non-2xx so
 * callers can hand the error straight to a toast without re-parsing. */
export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body?.error ?? body?.message ?? message;
    } catch {
      // response wasn't JSON — keep the generic message
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}