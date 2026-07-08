import { cookies } from "next/headers";
import { AdminUserPageResponse } from "./types/adminUser";

const BACKEND_URL = process.env.BACKEND_URL;

export async function getAdminUsers(params: {
  keyword?: string;
  role?: string;
  page?: string;
}): Promise<AdminUserPageResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const query = new URLSearchParams();
  if (params.keyword) query.set("keyword", params.keyword);
  if (params.role) query.set("role", params.role);
  query.set("page", params.page ?? "0");
  query.set("size", "20");

  const res = await fetch(`${BACKEND_URL}/api/admin/users?${query.toString()}`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to load users");
  return res.json();
}