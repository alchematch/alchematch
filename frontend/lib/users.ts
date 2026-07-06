import { cache } from "react";
import { cookies } from "next/headers";
import { UserResponse } from "./types/user";

const BACKEND_URL = process.env.BACKEND_URL;

export const getMyProfile = cache(async (): Promise<UserResponse | null> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) return null;

  const res = await fetch(`${BACKEND_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
});