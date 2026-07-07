"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL;

export async function applyToJob(jobId: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) {
    return { error: "You must be logged in to apply." };
  }

  const res = await fetch(`${BACKEND_URL}/api/jobs/${jobId}/apply`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    try {
      const body = await res.json();
      return { error: body.message || "Failed to apply." };
    } catch {
      return { error: "Failed to apply." };
    }
  }

  const data = await res.json();
  return { success: true, application: data };
}