"use server";

import { cookies } from "next/headers";
import { updateResume } from "./candidateProfileActions";

const BACKEND_URL = process.env.BACKEND_URL;

interface PresignedUploadResponse {
  uploadUrl: string;
  publicUrl: string;
  objectKey: string;
  expiresInSeconds: number;
}

async function authHeaders() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

async function getPresignedUploadUrl(
  purpose: string,
  contentType: string,
  fileExtension: string
): Promise<{ data?: PresignedUploadResponse; error?: string }> {
  const res = await fetch(`${BACKEND_URL}/api/uploads/presign`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify({ purpose, contentType, fileExtension }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { error: text || "Failed to prepare upload" };
  }

  return { data: await res.json() };
}

export async function uploadResumeFile(formData: FormData) {
  const file = formData.get("resumeFile") as File | null;

  if (!file || file.size === 0) {
    return { error: "Please choose a PDF file." };
  }

  if (file.type !== "application/pdf") {
    return { error: "Resume must be a PDF file." };
  }

  const fileExtension = file.name.split(".").pop() || "pdf";

  const presign = await getPresignedUploadUrl("RESUME", file.type, fileExtension);
  if (presign.error || !presign.data) {
    return { error: presign.error || "Failed to prepare upload" };
  }

  const { uploadUrl, publicUrl, objectKey } = presign.data;

  const fileBytes = await file.arrayBuffer();

  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: fileBytes,
  });

  if (!uploadRes.ok) {
    return { error: "Failed to upload file to storage." };
  }

  return updateResume(publicUrl, objectKey);
}