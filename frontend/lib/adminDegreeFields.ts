import { cookies } from "next/headers";
import { DegreeFieldResponse } from "./types/degreeField";

const BACKEND_URL = process.env.BACKEND_URL;

export async function getAllDegreeFields(): Promise<DegreeFieldResponse[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const res = await fetch(`${BACKEND_URL}/api/admin/degree-fields`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}