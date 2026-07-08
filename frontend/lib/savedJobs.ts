import { cookies } from "next/headers";
import { SavedJobPageResponse } from "./types/savedJob";

const BACKEND_URL = process.env.BACKEND_URL;

export async function getMySavedJobs(params: {
  keyword?: string;
  from?: string;
  to?: string;
  page?: string;
}): Promise<SavedJobPageResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const query = new URLSearchParams();
  if (params.keyword) query.set("keyword", params.keyword);
  if (params.from) query.set("from", params.from);
  if (params.to) query.set("to", params.to);
  query.set("page", params.page ?? "0");
  query.set("size", "10");

  const res = await fetch(`${BACKEND_URL}/api/me/saved-jobs?${query.toString()}`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to load saved jobs");
  return res.json();
}

export async function isJobSaved(jobId: number): Promise<boolean> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) return false;

  const res = await fetch(`${BACKEND_URL}/api/me/saved-jobs/${jobId}/exists`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!res.ok) return false;
  return res.json();
}