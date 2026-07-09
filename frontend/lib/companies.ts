import { cookies } from "next/headers";
import { CompanyProfileResponse, CompanyJobApplicationPageResponse } from "./types/company";
import { JobPageResponse } from "./types/job";

const BACKEND_URL = process.env.BACKEND_URL;

async function authHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

export async function getCompanyProfile(): Promise<CompanyProfileResponse | null> {
  const res = await fetch(`${BACKEND_URL}/api/company/profile`, {
    headers: await authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getCompanyJobs(params: {
  keyword?: string;
  page?: string;
  size?: string;
}): Promise<JobPageResponse> {
  const query = new URLSearchParams();
  if (params.keyword) query.set("keyword", params.keyword);
  query.set("page", params.page ?? "0");
  query.set("size", params.size ?? "10");

  const res = await fetch(`${BACKEND_URL}/api/company/jobs?${query.toString()}`, {
    headers: await authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load your jobs");
  return res.json();
}

export async function getCompanyJobApplicants(
  jobId: number,
  params: { keyword?: string; status?: string; page?: string }
): Promise<CompanyJobApplicationPageResponse> {
  const query = new URLSearchParams();
  if (params.keyword) query.set("keyword", params.keyword);
  if (params.status) query.set("status", params.status);
  query.set("page", params.page ?? "0");
  query.set("size", "10");

  const res = await fetch(
    `${BACKEND_URL}/api/company/jobs/${jobId}/applications?${query.toString()}`,
    { headers: await authHeaders(), cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to load applicants");
  return res.json();
}