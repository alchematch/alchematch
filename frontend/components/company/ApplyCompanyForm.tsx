"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { companyApplicationSchema, type CompanyApplicationInput } from "@/lib/validations";
import { applyForCompany } from "@/lib/companyApplications";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ApplyCompanyForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<CompanyApplicationInput>({
    resolver: zodResolver(companyApplicationSchema),
    defaultValues: { companyName: "", documentUrl: "" },
  });

  async function onSubmit(data: CompanyApplicationInput) {
    setServerError(null);
    const result = await applyForCompany(data.companyName, data.documentUrl);

    if (result.error) {
      setServerError(result.error);
      return;
    }

    router.push("/profile");
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="companyName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Company name</FieldLabel>
              <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="documentUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Verification document link</FieldLabel>
              <Input {...field} id={field.name} placeholder="https://..." aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {serverError && <p className="text-sm text-destructive">{serverError}</p>}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Submitting..." : "Submit application"}
        </Button>
      </FieldGroup>
    </form>
  );
}