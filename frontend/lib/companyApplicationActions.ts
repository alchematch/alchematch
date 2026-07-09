"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { CompanyApplicationDocument } from "./pdf/CompanyApplicationDocument";
import { applyForCompany } from "./companyApplications";

const BACKEND_URL = process.env.BACKEND_URL;

interface CompanyApplicationFormData {
  companyName: string;
  businessName: string;
  licenseNumber: string;
  businessAddress: string;
  registrationJurisdiction: string;
  phone: string;
  isoCertification?: string;
}

export async function submitCompanyApplicationForm(data: CompanyApplicationFormData) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) return { error: "You must be logged in." };

  // 1. Render the form data into a PDF, in memory
const pdfBuffer = await renderToBuffer(
    createElement(CompanyApplicationDocument, {
      ...data,
      submittedAt: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }) as any
  );

  // 2. Ask the backend for a presigned upload URL
  const presignRes = await fetch(`${BACKEND_URL}/api/uploads/presign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      purpose: "COMPANY_APPLICATION_DOCUMENT",
      contentType: "application/pdf",
      fileExtension: "pdf",
    }),
  });

  if (!presignRes.ok) {
    const text = await presignRes.text();
    return { error: text || "Failed to prepare document upload." };
  }

  const { uploadUrl, publicUrl, objectKey } = await presignRes.json();

  // 3. Upload the generated PDF directly to R2
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "application/pdf" },
    body: pdfBuffer as any,
  });

  if (!uploadRes.ok) {
    return { error: "Failed to upload generated document." };
  }

  // 4. Submit the application with the resulting document URL
  return applyForCompany(data.companyName, publicUrl, objectKey);
}

async function authHeaders(): Promise<Record<string, string>> {
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

export async function rejectCompanyApplication(applicationId: number, reason: string) {
  const res = await fetch(
    `${BACKEND_URL}/api/admin/company-applications/${applicationId}/reject`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeaders()) },
      body: JSON.stringify({ reason }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    return { error: text || "Failed to reject application" };
  }

  revalidatePath("/admin");
  return { success: true };
}