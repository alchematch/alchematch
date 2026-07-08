"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { DropdownCustom } from "@/components/ui/dropdown-custom";
import { updateApplicationStatus } from "@/lib/companyJobApplicationActions";
import { JobApplicationStatus } from "@/lib/types/company";

const nextValidStatuses: Record<JobApplicationStatus, JobApplicationStatus[]> = {
  PENDING: ["INTERVIEW", "REJECTED"],
  INTERVIEW: ["HIRED", "REJECTED"],
  HIRED: [],
  REJECTED: [],
  WITHDRAWN: [],
};

const statusStyles: Record<JobApplicationStatus, string> = {
  PENDING: "border-border text-muted-foreground",
  INTERVIEW: "border-brass text-brass",
  HIRED: "border-verdigris text-verdigris",
  REJECTED: "border-cinnabar text-cinnabar",
  WITHDRAWN: "border-muted-foreground text-muted-foreground",
};

const statusLabels: Record<JobApplicationStatus, string> = {
  PENDING: "Pending",
  INTERVIEW: "Move to Interview",
  HIRED: "Mark Hired",
  REJECTED: "Reject",
  WITHDRAWN: "Withdrawn",
};

export function ApplicationStatusControl({
  applicationId,
  status,
}: {
  applicationId: number;
  status: JobApplicationStatus;
}) {
  const router = useRouter();
  const options = nextValidStatuses[status];

  async function handleChange(newStatus: JobApplicationStatus) {
    const result = await updateApplicationStatus(applicationId, newStatus);
    if (!result.error) router.refresh();
  }

  if (options.length === 0) {
    return (
      <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] ${statusStyles[status]}`}>
        {status}
      </span>
    );
  }

  return (
    <DropdownCustom
      trigger={
        <button
          className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[10px] ${statusStyles[status]}`}
        >
          {status}
          <ChevronDown className="h-3 w-3" />
        </button>
      }
      items={options.map((s) => ({
        label: statusLabels[s],
        onClick: () => handleChange(s),
        variant: s === "REJECTED" ? ("destructive" as const) : undefined,
      }))}
      align="right"
    />
  );
}