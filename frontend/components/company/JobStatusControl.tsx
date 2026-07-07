"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { DropdownCustom } from "@/components/ui/dropdown-custom";
import { changeJobStatus } from "@/lib/jobActions";

type JobStatus = "DRAFT" | "PUBLISHED" | "CLOSED";

const statusOptions: { status: JobStatus; label: string }[] = [
  { status: "DRAFT", label: "Set to Draft" },
  { status: "PUBLISHED", label: "Publish" },
  { status: "CLOSED", label: "Close" },
];

const statusStyles: Record<JobStatus, string> = {
  DRAFT: "border-border text-muted-foreground",
  PUBLISHED: "border-verdigris text-verdigris",
  CLOSED: "border-cinnabar text-cinnabar",
};

export function JobStatusControl({ jobId, status }: { jobId: number; status: JobStatus }) {
  const router = useRouter();

  async function handleChange(newStatus: JobStatus) {
    if (newStatus === status) return;
    const result = await changeJobStatus(jobId, newStatus);
    if (!result.error) router.refresh();
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
      items={statusOptions
        .filter((opt) => opt.status !== status)
        .map((opt) => ({
          label: opt.label,
          onClick: () => handleChange(opt.status),
        }))}
      align="right"
    />
  );
}