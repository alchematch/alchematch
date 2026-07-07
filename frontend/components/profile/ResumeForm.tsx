"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { resumeUrlSchema, type ResumeUrlInput } from "@/lib/validations";
import { updateResume } from "@/lib/candidateProfileActions";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ResumeForm({ currentResumeUrl }: { currentResumeUrl: string | null }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const form = useForm<ResumeUrlInput>({
    resolver: zodResolver(resumeUrlSchema),
    defaultValues: { resumeUrl: currentResumeUrl ?? "" },
  });

  async function onSubmit(data: ResumeUrlInput) {
    setServerError(null);
    setSaved(false);

    const result = await updateResume(data.resumeUrl);

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
          name="resumeUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Resume link</FieldLabel>
              <Input {...field} id={field.name} placeholder="https://..." aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {serverError && <p className="text-sm text-destructive">{serverError}</p>}
        {saved && !serverError && <p className="text-sm text-verdigris">Saved.</p>}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save resume"}
        </Button>
      </FieldGroup>
    </form>
  );
}