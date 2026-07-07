"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.BACKEND_URL;

async function authHeaders() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

export async function approveCompanyApplication(applicationId: number) {
  const res = await fetch(
    `${BACKEND_URL}/api/admin/company-applications/${applicationId}/approve`,
    { method: "POST", headers: await authHeaders() }
  );

  if (!res.ok) {
    const text = await res.text();
    return { error: text || "Failed to approve application" };
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function rejectCompanyApplication(applicationId: number) {
  const res = await fetch(
    `${BACKEND_URL}/api/admin/company-applications/${applicationId}/reject`,
    { method: "POST", headers: await authHeaders() }
  );

  if (!res.ok) {
    const text = await res.text();
    return { error: text || "Failed to reject application" };
  }

  revalidatePath("/admin");
  return { success: true };
}