"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteJob } from "@/lib/jobActions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function DeleteJobButton({ jobId }: { jobId: number }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    setPending(true);
    const result = await deleteJob(jobId);
    setPending(false);
    setConfirming(false);
    if (!result.error) {
      router.refresh();
    }
  }

  return (
    <>
      <button
        onClick={() => setConfirming(true)}
        disabled={pending}
        className="text-destructive hover:underline disabled:opacity-50"
      >
        {pending ? "Deleting..." : "Delete"}
      </button>

      {confirming && (
        <ConfirmDialog
          title="Delete job listing"
          description="Delete this job listing? This can't be undone."
          confirmLabel="Delete"
          pending={pending}
          onConfirm={handleDelete}
          onCancel={() => setConfirming(false)}
        />
      )}
    </>
  );
}