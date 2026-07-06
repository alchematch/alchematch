"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL;

export async function login(username: string, password: string) {
  const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    return { error: "Invalid username or password" };
  }

  const data = await res.json(); // { jwtToken, username, roles }
  const cookieStore = await cookies();

  cookieStore.set("access_token", data.jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return { success: true, username: data.username, roles: data.roles };
}

export async function register(username: string, email: string, password: string) {
  const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    // Register returns plain text, not JSON, on error too
    const text = await res.text();
    return { error: text || "Registration failed" };
  }

  // Register succeeded but doesn't return a token — reuse login()
  // so the user is authenticated immediately after registering.
  return login(username, password);
}

export async function logout() {
  // Backend is fully stateless JWT with no server-side invalidation —
  // logout is just clearing the cookie, no backend call needed.
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return null;

  const res = await fetch(`${BACKEND_URL}/api/users/me/basic`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json(); // { id, username, email, role, enabled }
}

export async function requestPasswordReset(email: string) {
  const res = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  // Backend always returns 204 regardless of whether the email exists —
  // this is intentional to prevent email enumeration.
  if (!res.ok) {
    return { error: "Something went wrong. Please try again." };
  }

  return { success: true };
}

export async function confirmPasswordReset(token: string, newPassword: string) {
  const res = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!res.ok) {
    return { error: "Invalid or expired reset link." };
  }

  return { success: true };
}
