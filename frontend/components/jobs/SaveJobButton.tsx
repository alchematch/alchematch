"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { saveJob, unsaveJob } from "@/lib/savedJobActions";

export function SaveJobButton({ jobId, alreadySaved }: { jobId: number; alreadySaved: boolean }) {
  const [saved, setSaved] = useState(alreadySaved);
  const [pending, setPending] = useState(false);

  async function handleToggle() {
    setPending(true);
    const result = saved ? await unsaveJob(jobId) : await saveJob(jobId);
    setPending(false);

    if (!result.error) {
      setSaved(!saved);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-card disabled:opacity-50"
    >
      {saved ? (
        <>
          <BookmarkCheck className="h-4 w-4 text-brass" />
          Saved
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4" />
          Save
        </>
      )}
    </button>
  );
}