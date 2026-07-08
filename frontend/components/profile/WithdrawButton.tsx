"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { withdrawApplication } from "@/lib/jobApplicationActions";

export function WithdrawButton({ applicationId }: { applicationId: number }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleWithdraw() {
    if (!confirm("Withdraw this application? This can't be undone.")) return;
    setPending(true);
    setError(null);

    const result = await withdrawApplication(applicationId);
    setPending(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.refresh();
  }

  return (
    <div>
      <button
        onClick={handleWithdraw}
        disabled={pending}
        className="text-sm text-destructive hover:underline disabled:opacity-50"
      >
        {pending ? "Withdrawing..." : "Withdraw"}
      </button>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}