"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { candidateProfileSchema, type CandidateProfileInput } from "@/lib/validations";
import { updateCandidateProfile } from "@/lib/candidateProfileActions";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { educationLevelLabels, EducationLevel } from "@/lib/types/candidateProfile";
import { DegreeFieldOption } from "@/lib/degreeFields";

const educationLevels: EducationLevel[] = [
  "HIGH_SCHOOL",
  "ASSOCIATE",
  "BACHELORS",
  "MASTERS",
  "DOCTORATE",
  "OTHER",
];

interface CandidateProfileFormProps {
  degreeFields: DegreeFieldOption[];
  defaultValues: Partial<CandidateProfileInput>;
}

export function CandidateProfileForm({ degreeFields, defaultValues }: CandidateProfileFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const form = useForm<z.input<typeof candidateProfileSchema>, any, z.output<typeof candidateProfileSchema>>({
    resolver: zodResolver(candidateProfileSchema),
    defaultValues,
  });

  async function onSubmit(data: CandidateProfileInput) {
    setServerError(null);
    setSaved(false);

    const result = await updateCandidateProfile({
      educationLevel: data.educationLevel || undefined,
      degreeFieldId: data.degreeFieldId,
      yearsExperience: data.yearsExperience,
      phone: data.phone || undefined,
      location: data.location || undefined,
    });

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
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="educationLevel"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Education level</FieldLabel>
                <select
                  {...field}
                  value={field.value ?? ""}
                  id={field.name}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brass"
                >
                  <option value="">Select...</option>
                  {educationLevels.map((level) => (
                    <option key={level} value={level}>
                      {educationLevelLabels[level]}
                    </option>
                  ))}
                </select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="degreeFieldId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Degree field</FieldLabel>
                <select
                  {...field}
                  value={(field.value as number | string | undefined) ?? ""}
                  id={field.name}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brass"
                >
                  <option value="">Select...</option>
                  {degreeFields.map((df) => (
                    <option key={df.id} value={df.id}>
                      {df.name}
                    </option>
                  ))}
                </select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          name="yearsExperience"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Years of experience</FieldLabel>
              <Input
                {...field}
                value={(field.value as number | string | undefined) ?? ""}
                id={field.name}
                type="number"
                min="0"
                step="0.5"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Phone (optional)</FieldLabel>
                <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
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
        </div>

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}
        {saved && !serverError && <p className="text-sm text-verdigris">Saved.</p>}

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save profile"}
        </Button>
      </FieldGroup>
    </form>
  );
}