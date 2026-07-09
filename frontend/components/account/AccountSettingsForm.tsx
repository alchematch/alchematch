"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  changeUsernameSchema,
  type ChangeUsernameInput,
  changeEmailSchema,
  type ChangeEmailInput,
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/lib/validations";
import { changeUsername, changeEmail, changePassword } from "@/lib/accountActions";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";

function UsernameSection({ currentUsername }: { currentUsername: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const form = useForm<ChangeUsernameInput>({
    resolver: zodResolver(changeUsernameSchema),
    defaultValues: { username: currentUsername },
  });

  async function onSubmit(data: ChangeUsernameInput) {
    setServerError(null);
    setSaved(false);
    const result = await changeUsername(data.username);
    if (result.error) {
      setServerError(result.error);
      return;
    }
    setSaved(true);
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
        {serverError && <p className="text-sm text-destructive">{serverError}</p>}
        {saved && !serverError && <p className="text-sm text-verdigris">Username updated.</p>}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Update username"}
        </Button>
      </FieldGroup>
    </form>
  );
}

function EmailSection({ currentEmail }: { currentEmail: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const form = useForm<ChangeEmailInput>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { email: currentEmail },
  });

  async function onSubmit(data: ChangeEmailInput) {
    setServerError(null);
    setSaved(false);
    const result = await changeEmail(data.email);
    if (result.error) {
      setServerError(result.error);
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
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
        {serverError && <p className="text-sm text-destructive">{serverError}</p>}
        {saved && !serverError && <p className="text-sm text-verdigris">Email updated.</p>}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Update email"}
        </Button>
      </FieldGroup>
    </form>
  );
}

function PasswordSection() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  async function onSubmit(data: ChangePasswordInput) {
    setServerError(null);
    setSaved(false);
    const result = await changePassword(data.currentPassword, data.newPassword);
    if (result.error) {
      setServerError(result.error);
      return;
    }
    setSaved(true);
    form.reset({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="currentPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Current password</FieldLabel>
              <PasswordInput {...field} id={field.name} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="newPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>New password</FieldLabel>
              <PasswordInput {...field} id={field.name} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="confirmNewPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Confirm new password</FieldLabel>
              <PasswordInput {...field} id={field.name} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {serverError && <p className="text-sm text-destructive">{serverError}</p>}
        {saved && !serverError && <p className="text-sm text-verdigris">Password updated.</p>}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Update password"}
        </Button>
      </FieldGroup>
    </form>
  );
}

export function AccountSettingsForm({
  currentUsername,
  currentEmail,
}: {
  currentUsername: string;
  currentEmail: string;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Username</h2>
        <div className="mt-4">
          <UsernameSection currentUsername={currentUsername} />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Email</h2>
        <div className="mt-4">
          <EmailSection currentEmail={currentEmail} />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Password</h2>
        <div className="mt-4">
          <PasswordSection />
        </div>
      </div>
    </div>
  );
}