"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { jobFormSchema, type JobFormInput } from "@/lib/validations";
import { createJob, updateJob } from "@/lib/jobActions";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { employmentTypeLabels, EmploymentType } from "@/lib/types/job";

const employmentTypes: EmploymentType[] = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN", "TEMPORARY", "REMOTE"];
const payPeriods = ["HOUR", "MONTH", "YEAR"] as const;
const payTypes = ["SALARY", "HOURLY", "CONTRACT", "COMMISSION"] as const;

interface JobFormProps {
  jobId?: number;
  defaultValues?: Partial<JobFormInput>;
}

export function JobForm({ jobId, defaultValues }: JobFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<JobFormInput>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      description: "",
      employmentType: "FULL_TIME",
      tagline: "",
      level: "",
      location: "",
      benefits: "",
      minimumRequirements: "",
      ...defaultValues,
    },
  });

  async function onSubmit(data: JobFormInput) {
    setServerError(null);

    const payload = {
      title: data.title,
      description: data.description,
      employmentType: data.employmentType,
      tagline: data.tagline || undefined,
      level: data.level || undefined,
      payMin: data.payMin,
      payMax: data.payMax,
      payPeriod: data.payPeriod || undefined,
      payType: data.payType || undefined,
      location: data.location || undefined,
      benefits: data.benefits ? data.benefits.split("\n").map((s) => s.trim()).filter(Boolean) : [],
      minimumRequirements: data.minimumRequirements
        ? data.minimumRequirements.split("\n").map((s) => s.trim()).filter(Boolean)
        : [],
    };

    const result = jobId ? await updateJob(jobId, payload) : await createJob(payload);

    if (result.error) {
      setServerError(result.error);
      return;
    }

    router.push("/company/jobs");
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Job title</FieldLabel>
              <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="tagline"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Tagline (optional)</FieldLabel>
              <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Description</FieldLabel>
              <Textarea {...field} id={field.name} rows={6} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="employmentType"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Employment type</FieldLabel>
                <select
                  {...field}
                  id={field.name}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brass"
                >
                  {employmentTypes.map((type) => (
                    <option key={type} value={type}>{employmentTypeLabels[type]}</option>
                  ))}
                </select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="level"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Level (optional)</FieldLabel>
                <Input {...field} id={field.name} placeholder="e.g. Senior" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="payMin"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Min pay (optional)</FieldLabel>
                <Input {...field} value={field.value ?? ""} id={field.name} type="number" min="0" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="payMax"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Max pay (optional)</FieldLabel>
                <Input {...field} value={field.value ?? ""} id={field.name} type="number" min="0" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="payPeriod"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Pay period (optional)</FieldLabel>
                <select
                  {...field}
                  value={field.value ?? ""}
                  id={field.name}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brass"
                >
                  <option value="">—</option>
                  {payPeriods.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="payType"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Pay type (optional)</FieldLabel>
                <select
                  {...field}
                  value={field.value ?? ""}
                  id={field.name}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brass"
                >
                  <option value="">—</option>
                  {payTypes.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          name="location"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Location (optional)</FieldLabel>
              <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="minimumRequirements"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Minimum requirements (one per line)</FieldLabel>
              <Textarea {...field} id={field.name} rows={4} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="benefits"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Benefits (one per line)</FieldLabel>
              <Textarea {...field} id={field.name} rows={4} aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : jobId ? "Save changes" : "Post job"}
        </Button>
      </FieldGroup>
    </form>
  );
}