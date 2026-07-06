import { redirect } from "next/navigation";
import { getMyProfile } from "./users";
import type { AppRole, UserResponse } from "./types/user";

export async function requireUser(): Promise<UserResponse> {
  const user = await getMyProfile();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(
  role: AppRole | AppRole[],
  fallback: string = "/"
): Promise<UserResponse> {
  const user = await requireUser();
  const allowed = Array.isArray(role) ? role : [role];
  if (!allowed.includes(user.role as AppRole)) {
    redirect(fallback);
  }
  return user;
}