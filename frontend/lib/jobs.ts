import { JobPageResponse, JobResponse, JobSearchParams } from "./types/job";

const BACKEND_URL = process.env.BACKEND_URL;

export async function getPublishedJobs(
  params: JobSearchParams
): Promise<JobPageResponse> {
  const query = new URLSearchParams();

  if (params.keyword) query.set("keyword", params.keyword);
  if (params.employmentType) query.set("employmentType", params.employmentType);
  if (params.minPay) query.set("minPay", params.minPay);
  if (params.maxPay) query.set("maxPay", params.maxPay);
  if (params.location) query.set("location", params.location);
  if (params.from) query.set("from", params.from);
  if (params.to) query.set("to", params.to);
  query.set("page", params.page ?? "0");
  query.set("page", params.page ?? "0");
  query.set("size", "10");

  const res = await fetch(`${BACKEND_URL}/api/public/jobs?${query.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load jobs");
  }

  return res.json();
}

export async function getPublishedJobById(jobId: number): Promise<JobResponse> {
  const res = await fetch(`${BACKEND_URL}/api/public/jobs/${jobId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Job not found");
  }

  return res.json();
}