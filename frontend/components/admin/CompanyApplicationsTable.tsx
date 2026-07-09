"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { DropdownCustom } from "@/components/ui/dropdown-custom";
import { Button } from "@/components/ui/button";
import { approveCompanyApplication, rejectCompanyApplication } from "@/lib/companyApplicationActions";
import { AdminCompanyApplicationResponse } from "@/lib/types/company";
import { RejectApplicationDialog } from "./RejectApplicationDialog";

export function CompanyApplicationsTable({
  applications,
}: {
  applications: AdminCompanyApplicationResponse[];
}) {
  const router = useRouter();
  const [rejectingId, setRejectingId] = useState<number | null>(null);

  async function handleApprove(id: number) {
    const result = await approveCompanyApplication(id);
    if (!result.error) router.refresh();
  }

  async function handleConfirmReject(reason: string) {
    if (rejectingId === null) return;
    const result = await rejectCompanyApplication(rejectingId, reason);
    setRejectingId(null);
    if (!result.error) router.refresh();
  }

  if (applications.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No company applications to review.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {applications.map((app) => (
        <div key={app.applicationId} className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-heading text-base font-semibold text-foreground">
                {app.companyName}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {app.applicantUsername} · {app.applicantEmail}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Applied {new Date(app.appliedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="shrink-0 rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                {app.status}
              </span>
              {app.status === "PENDING" && (
                <DropdownCustom
                  trigger={
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  }
                  items={[
                    { label: "Approve", onClick: () => handleApprove(app.applicationId) },
                    { label: "Reject", onClick: () => setRejectingId(app.applicationId), variant: "destructive" },
                  ]}
                  align="right"
                />
              )}
            </div>
          </div>

          {app.status === "REJECTED" && app.rejectionReason && (
            <p className="mt-3 text-sm text-cinnabar">Reason: {app.rejectionReason}</p>
          )}

          <a
            href={app.documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm text-brass hover:underline"
          >
            View verification document
          </a>
        </div>
      ))}

      {rejectingId !== null && (
        <RejectApplicationDialog
          onCancel={() => setRejectingId(null)}
          onConfirm={handleConfirmReject}
        />
      )}
    </div>
  );
}