import { cookies } from "next/headers";
import { JobApplicationPageResponse } from "./types/jobApplication";

const BACKEND_URL = process.env.BACKEND_URL;

export async function getMyApplications(params: {
  keyword?: string;
  status?: string;
  page?: string;
}): Promise<JobApplicationPageResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const query = new URLSearchParams();
  if (params.keyword) query.set("keyword", params.keyword);
  if (params.status) query.set("status", params.status);
  query.set("page", params.page ?? "0");
  query.set("size", "10");

  const res = await fetch(`${BACKEND_URL}/api/job-applications/me?${query.toString()}`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to load your applications");
  return res.json();
}