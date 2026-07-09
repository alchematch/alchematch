"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const REJECTION_REASON_OPTIONS = [
  "Incomplete information",
  "Address does not match records",
  "Submitted information does not match",
  "Unable to verify business",
  "Invalid or expired license",
  "Document illegible or invalid",
  "Duplicate application",
  "Suspected fraudulent submission",
];

interface RejectApplicationDialogProps {
  onCancel: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

export function RejectApplicationDialog({ onCancel, onConfirm }: RejectApplicationDialogProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(option: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(option)) next.delete(option);
      else next.add(option);
      return next;
    });
  }

  async function handleConfirm() {
    if (selected.size === 0) {
      setError("Select at least one reason.");
      return;
    }
    setError(null);
    setSubmitting(true);
    await onConfirm(Array.from(selected).join(", "));
    setSubmitting(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-md rounded-lg border border-line bg-paper p-6 shadow-lg">
        <h3 className="font-heading text-lg font-semibold text-ink">Reject application</h3>
        <p className="mt-1 text-sm text-ink/70">
          Select one or more reasons. These will be shown to the applicant.
        </p>

        <div className="mt-4 flex flex-col gap-2">
          {REJECTION_REASON_OPTIONS.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm text-ink hover:bg-line/20"
            >
              <input
                type="checkbox"
                checked={selected.has(option)}
                onChange={() => toggle(option)}
                className="h-4 w-4"
              />
              {option}
            </label>
          ))}
        </div>

        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={submitting}>
            {submitting ? "Rejecting..." : "Confirm rejection"}
          </Button>
        </div>
      </div>
    </div>
  );
}