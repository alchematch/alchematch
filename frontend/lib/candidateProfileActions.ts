"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.BACKEND_URL;

async function authHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

interface ProfileUpdatePayload {
  educationLevel?: string;
  degreeFieldId?: number;
  yearsExperience?: number;
  phone?: string;
  location?: string;
}

export async function updateCandidateProfile(data: ProfileUpdatePayload) {
  const res = await fetch(`${BACKEND_URL}/api/users/me/profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    return { error: text || "Failed to update profile" };
  }

  revalidatePath("/profile/candidate-profile");
  revalidatePath("/profile");
  return { success: true };
}

export async function updateResume(resumeUrl: string, resumePublicId?: string) {
  // If no real publicId is passed (e.g. any legacy caller), fall back to a placeholder.
  const finalPublicId = resumePublicId ?? `manual-${Date.now()}`;

  const res = await fetch(`${BACKEND_URL}/api/users/me/profile/resume`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify({ resumeUrl, resumePublicId: finalPublicId }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { error: text || "Failed to update resume" };
  }

  revalidatePath("/profile/candidate-profile");
  revalidatePath("/profile");
  return { success: true };
}