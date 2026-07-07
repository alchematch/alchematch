"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { degreeFieldSchema, type DegreeFieldInput } from "@/lib/validations";
import { createDegreeField } from "@/lib/degreeFieldActions";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CreateDegreeFieldForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<DegreeFieldInput>({
    resolver: zodResolver(degreeFieldSchema),
    defaultValues: { name: "" },
  });

  async function onSubmit(data: DegreeFieldInput) {
    setServerError(null);
    const result = await createDegreeField(data.name);

    if (result.error) {
      setServerError(result.error);
      return;
    }

    form.reset();
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-3">
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="flex-1">
            <FieldLabel htmlFor={field.name}>New degree field</FieldLabel>
            <Input {...field} id={field.name} placeholder="e.g. Computer Science" aria-invalid={fieldState.invalid} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" disabled={form.formState.isSubmitting} className="mt-6">
        {form.formState.isSubmitting ? "Adding..." : "Add"}
      </Button>
      {serverError && <p className="mt-2 text-sm text-destructive">{serverError}</p>}
    </form>
  );
}