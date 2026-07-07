"use client";

import { useState } from "react";
import Link from "next/link";
import { applyToJob } from "@/lib/jobApplicationActions";
import { Button } from "@/components/ui/button";

export function ApplyButton({ jobId, alreadyApplied }: { jobId: number; alreadyApplied: boolean }) {
  const [state, setState] = useState<"idle" | "loading" | "applied" | "error">(
    alreadyApplied ? "applied" : "idle"
  );
  const [message, setMessage] = useState<string | null>(null);

  async function handleApply() {
    setState("loading");
    setMessage(null);

    const result = await applyToJob(jobId);

    if (result.error) {
      setState("error");
      setMessage(result.error);
      return;
    }

    setState("applied");
  }

  if (state === "applied") {
    return (
      <div className="rounded-md border border-verdigris bg-verdigris/10 px-4 py-2 text-sm text-verdigris">
        Application submitted.
      </div>
    );
  }

  return (
    <div>
      <Button onClick={handleApply} disabled={state === "loading"}>
        {state === "loading" ? "Applying..." : "Apply now"}
      </Button>
      {state === "error" && message && (
        <div className="mt-2 text-sm text-destructive">
          {message}
          {(message.toLowerCase().includes("profile") || message.toLowerCase().includes("degree field")) && (
            <>
              {" "}
              <Link href="/profile/candidate-profile" className="underline underline-offset-4">
                Update your profile
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}