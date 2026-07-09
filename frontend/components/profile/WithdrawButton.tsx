"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { withdrawApplication } from "@/lib/jobApplicationActions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function WithdrawButton({ applicationId }: { applicationId: number }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  async function handleWithdraw() {
    setPending(true);
    setError(null);
    const result = await withdrawApplication(applicationId);
    setPending(false);
    setConfirming(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <button
        onClick={() => setConfirming(true)}
        disabled={pending}
        className="text-sm text-destructive hover:underline disabled:opacity-50"
      >
        {pending ? "Withdrawing..." : "Withdraw"}
      </button>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}

      {confirming && (
        <ConfirmDialog
          title="Withdraw application"
          description="Withdraw this application? This can't be undone."
          confirmLabel="Withdraw"
          pending={pending}
          onConfirm={handleWithdraw}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
}