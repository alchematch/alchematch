export async function parseApiErrorMessage(res: Response, fallback: string): Promise<string> {
  const text = await res.text();
  if (!text) return fallback;

  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed.message === "string") {
      return parsed.message;
    }
  } catch {
    // Not JSON — endpoint returns a plain-text error body (e.g. /api/auth/register).
  }

  return text || fallback;
}