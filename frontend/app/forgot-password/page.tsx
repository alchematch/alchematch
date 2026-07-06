import Link from "next/link";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthMark } from "@/components/auth/AuthMark";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout visual={<AuthMark />} tagline="We'll get you back in.">
      <h1 className="mb-2 text-2xl font-semibold">Forgot your password?</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Enter your email and we&apos;ll send you a reset link.
      </p>
      <ForgotPasswordForm />
      <p className="mt-4 text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}