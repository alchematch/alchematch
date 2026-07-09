"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.BACKEND_URL;

async function authHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

export async function createDegreeField(name: string) {
  const res = await fetch(`${BACKEND_URL}/api/admin/degree-fields`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { error: text || "Failed to create degree field" };
  }

  revalidatePath("/admin/degree-fields");
  return { success: true };
}

export async function toggleDegreeFieldActive(id: number, active: boolean) {
  const res = await fetch(`${BACKEND_URL}/api/admin/degree-fields/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify({ active }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { error: text || "Failed to update degree field" };
  }

  revalidatePath("/admin/degree-fields");
  return { success: true };
}