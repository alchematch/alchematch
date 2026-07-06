"use server";

import { cookies } from "next/headers";
import { CompanyApplicationResponse } from "./types/user";

const BACKEND_URL = process.env.BACKEND_URL;

export async function applyForCompany(companyName: string, documentUrl: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) return { error: "You must be logged in." };

  // documentPublicId is an internal reference for the file-storage provider
  // (e.g. Cloudinary's public ID). Real upload isn't wired up yet, so we
  // generate a placeholder here instead of asking the user to type one.
  const documentPublicId = `manual-${Date.now()}`;

  const res = await fetch(`${BACKEND_URL}/api/company-applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ companyName, documentPublicId, documentUrl }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { error: text || "Failed to submit application." };
  }

  return { success: true };
}

export async function getMyCompanyApplication(): Promise<CompanyApplicationResponse | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) return null;

  const res = await fetch(`${BACKEND_URL}/api/company-applications/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}