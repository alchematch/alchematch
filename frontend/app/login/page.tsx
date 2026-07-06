import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthMark } from "@/components/auth/AuthMark";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <AuthLayout visual={<AuthMark />} tagline="Turn your experience into your next offer.">
      <h1 className="mb-6 text-2xl font-semibold">Log in</h1>
      <LoginForm />
    </AuthLayout>
  );
}