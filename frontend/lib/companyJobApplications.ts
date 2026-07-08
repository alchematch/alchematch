import { cookies } from "next/headers";
import { CompanyJobApplicationPageResponse } from "./types/company";

const BACKEND_URL = process.env.BACKEND_URL;

export async function getCompanyJobApplications(params: {
  keyword?: string;
  status?: string;
  minYears?: string;
  degreeFieldId?: string;
  educationLevel?: string;
  page?: string;
}): Promise<CompanyJobApplicationPageResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const query = new URLSearchParams();
  if (params.keyword) query.set("keyword", params.keyword);
  if (params.status) query.set("status", params.status);
  if (params.minYears) query.set("minYears", params.minYears);
  if (params.degreeFieldId) query.set("degreeFieldId", params.degreeFieldId);
  if (params.educationLevel) query.set("educationLevel", params.educationLevel);
  query.set("page", params.page ?? "0");
  query.set("size", "10");

  const res = await fetch(`${BACKEND_URL}/api/company/job-applications/list?${query.toString()}`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to load applications");
  return res.json();
}