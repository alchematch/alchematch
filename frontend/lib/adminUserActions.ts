"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { parseApiErrorMessage } from "./apiError";

const BACKEND_URL = process.env.BACKEND_URL;

async function authHeaders() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

export async function updateUserModeration(
  userId: number,
  data: { enabled?: boolean; accountNonLocked?: boolean }
) {
  const res = await fetch(`${BACKEND_URL}/api/admin/users/${userId}/moderation`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    return { error: await parseApiErrorMessage(res, "Failed to update user.") };
  }

  revalidatePath("/admin/moderation");
  return { success: true };
}