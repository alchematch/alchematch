"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.BACKEND_URL;

export async function updateApplicationStatus(applicationId: number, status: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) return { error: "You must be logged in." };

  const res = await fetch(`${BACKEND_URL}/api/company/job-applications/${applicationId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    try {
      const body = await res.json();
      return { error: body.message || "Failed to update status." };
    } catch {
      return { error: "Failed to update status." };
    }
  }

  revalidatePath("/company/applications");
  return { success: true };
}