"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteJob } from "@/lib/jobActions";

export function DeleteJobButton({ jobId }: { jobId: number }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this job listing? This can't be undone.")) return;
    setPending(true);
    const result = await deleteJob(jobId);
    setPending(false);
    if (!result.error) {
      router.refresh();
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="text-destructive hover:underline disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}