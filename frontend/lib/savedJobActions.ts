"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.BACKEND_URL;

async function authHeaders() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

export async function saveJob(jobId: number) {
  const res = await fetch(`${BACKEND_URL}/api/me/saved-jobs/${jobId}`, {
    method: "POST",
    headers: await authHeaders(),
  });

  if (!res.ok) {
    return { error: "Failed to save job." };
  }

  revalidatePath("/profile/saved-jobs");
  return { success: true };
}

export async function unsaveJob(jobId: number) {
  const res = await fetch(`${BACKEND_URL}/api/me/saved-jobs/${jobId}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });

  if (!res.ok) {
    return { error: "Failed to remove saved job." };
  }

  revalidatePath("/profile/saved-jobs");
  return { success: true };
}