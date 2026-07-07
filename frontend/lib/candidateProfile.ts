import { cookies } from "next/headers";
import { CandidateProfileResponse } from "./types/candidateProfile";

const BACKEND_URL = process.env.BACKEND_URL;

export async function getCandidateProfile(): Promise<CandidateProfileResponse | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) return null;

  const res = await fetch(`${BACKEND_URL}/api/users/me/profile`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}