import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { RegisterForm } from "@/components/register-form";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthMark } from "@/components/auth/AuthMark";
import Link from "next/link";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <AuthLayout visual={<AuthMark />} tagline="Solve et Coagula — find what fits." reverse>
      <h1 className="mb-6 text-2xl font-semibold">Create an account</h1>
      <RegisterForm />
      <p className="mt-4 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}