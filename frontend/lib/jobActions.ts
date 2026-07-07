"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.BACKEND_URL;

interface JobPayload {
  title: string;
  description: string;
  employmentType: string;
  tagline?: string;
  level?: string;
  payMin?: number;
  payMax?: number;
  payPeriod?: string;
  payType?: string;
  location?: string;
  benefits: string[];
  minimumRequirements: string[];
  degreeFieldIds?: number[];
}

async function authHeaders() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

export async function createJob(data: JobPayload) {
  const res = await fetch(`${BACKEND_URL}/api/company/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    return { error: text || "Failed to create job" };
  }

  revalidatePath("/company/jobs");
  const job = await res.json();
  return { success: true, jobId: job.id };
}

export async function updateJob(jobId: number, data: Partial<JobPayload>) {
  const res = await fetch(`${BACKEND_URL}/api/company/jobs/${jobId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    return { error: text || "Failed to update job" };
  }

  revalidatePath("/company/jobs");
  return { success: true };
}

export async function deleteJob(jobId: number) {
  const res = await fetch(`${BACKEND_URL}/api/company/jobs/${jobId}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });

  if (!res.ok) {
    return { error: "Failed to delete job" };
  }

  revalidatePath("/company/jobs");
  return { success: true };
}

export async function changeJobStatus(jobId: number, status: "DRAFT" | "PUBLISHED" | "CLOSED") {
  const res = await fetch(`${BACKEND_URL}/api/company/jobs/${jobId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { error: text || "Failed to update job status" };
  }

  revalidatePath("/company/jobs");
  return { success: true };
}