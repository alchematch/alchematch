"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { register } from "@/lib/auth";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(data: RegisterInput) {
    setServerError(null);

    const result = await register(data.username, data.email, data.password);

    if (result.error) {
      // Backend returns plain text on register failure (e.g. "Username is
      // already taken"), not per-field JSON — so we surface it as one
      // general error rather than mapping it to a specific field.
      setServerError(typeof result.error === "string" ? result.error : "Registration failed. Please try again.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Username</FieldLabel>
              <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input {...field} id={field.name} type="email" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
              <PasswordInput {...field} id={field.name} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
              <PasswordInput {...field} id={field.name} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {serverError && <p className="text-sm text-destructive">{serverError}</p>}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </FieldGroup>
    </form>
  );
}