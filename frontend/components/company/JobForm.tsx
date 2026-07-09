"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState} from "react";
import { useRouter } from "next/navigation";
import { jobFormSchema, type JobFormInput } from "@/lib/validations";
import { createJob, updateJob } from "@/lib/jobActions";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { employmentTypeLabels, EmploymentType } from "@/lib/types/job";
import { DegreeFieldOption } from "@/lib/degreeFields";

const employmentTypes: EmploymentType[] = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN", "TEMPORARY", "REMOTE"];
const payPeriods = ["HOUR", "MONTH", "YEAR"] as const;
const payTypes = ["SALARY", "HOURLY", "CONTRACT", "COMMISSION"] as const;

interface JobFormProps {
  jobId?: number;
  defaultValues?: Partial<JobFormInput>;
  degreeFields: DegreeFieldOption[];
}

export function JobForm({ jobId, defaultValues, degreeFields }: JobFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
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
      degreeFieldIds: [],
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
      degreeFieldIds: data.degreeFieldIds ?? [],
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
          name="degreeFieldIds"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="degreeFieldIds">
                Required degree fields (optional)
              </FieldLabel>
              <p className="text-xs text-muted-foreground">
                Leave all unchecked to allow any candidate to apply. Check one or more to
                restrict applicants to those degree fields.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {degreeFields.length === 0 && (
                  <p className="text-sm text-muted-foreground">No degree fields available yet.</p>
                )}
                {degreeFields.map((df) => {
                  const checked = (field.value ?? []).includes(df.id);
                  return (
                    <label
                      key={df.id}
                      className={`cursor-pointer rounded-full border px-3 py-1 text-sm ${
                        checked
                          ? "border-brass bg-brass/10 text-foreground"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={(e) => {
                          const current = field.value ?? [];
                          field.onChange(
                            e.target.checked
                              ? [...current, df.id]
                              : current.filter((id: number) => id !== df.id)
                          );
                        }}
                      />
                      {df.name}
                    </label>
                  );
                })}
              </div>
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