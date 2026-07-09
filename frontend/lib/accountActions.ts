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

export async function changeUsername(username: string) {
  const res = await fetch(`${BACKEND_URL}/api/users/me/username`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify({ username }),
  });

  if (!res.ok) {
    return { error: await parseApiErrorMessage(res, "Failed to update username") };
  }

  const data = await res.json(); // { username, accessToken }

  const cookieStore = await cookies();
  cookieStore.set("access_token", data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  revalidatePath("/profile");
  revalidatePath("/company");
  revalidatePath("/admin");
  return { success: true };
}

export async function changeEmail(email: string) {
  const res = await fetch(`${BACKEND_URL}/api/users/me/email`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    return { error: await parseApiErrorMessage(res, "Failed to update email") };
  }

  revalidatePath("/profile");
  revalidatePath("/company");
  revalidatePath("/admin");
  return { success: true };
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const res = await fetch(`${BACKEND_URL}/api/users/me/password`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!res.ok) {
    return { error: await parseApiErrorMessage(res, "Failed to update password") };
  }

  return { success: true };
}