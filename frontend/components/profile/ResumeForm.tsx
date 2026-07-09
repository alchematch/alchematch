"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { uploadResumeFile } from "@/lib/uploadActions";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function ResumeForm({ currentResumeUrl }: { currentResumeUrl: string | null }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    setSaved(false);

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setServerError("Please choose a PDF file.");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.set("resumeFile", file);

    const result = await uploadResumeFile(formData);
    setSubmitting(false);

    if (result.error) {
      setServerError(result.error);
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="resumeFile">Resume (PDF)</FieldLabel>
          <input
            ref={fileInputRef}
            id="resumeFile"
            name="resumeFile"
            type="file"
            accept="application/pdf"
            onChange={(e) => setSelectedFileName(e.target.files?.[0]?.name ?? null)}
            className="block w-full text-sm text-ink file:mr-4 file:rounded-md file:border-0 file:bg-brass file:px-4 file:py-2 file:text-paper file:text-sm file:font-medium hover:file:opacity-90"
          />
          {selectedFileName && (
            <p className="text-sm text-ink/70 mt-1">Selected: {selectedFileName}</p>
          )}
          {currentResumeUrl && !selectedFileName && (
            <p className="text-sm text-ink/70 mt-1">
              Current resume:{" "}
              <a href={currentResumeUrl} target="_blank" rel="noopener noreferrer" className="underline">
                view file
              </a>
            </p>
          )}
          {serverError && <FieldError errors={[{ message: serverError }]} />}
        </Field>
        {saved && !serverError && <p className="text-sm text-verdigris">Saved.</p>}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Uploading..." : "Upload resume"}
        </Button>
      </FieldGroup>
    </form>
  );
}