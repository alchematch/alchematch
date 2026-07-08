import { JobApplicationResponse } from "@/lib/types/jobApplication";
import { WithdrawButton } from "@/components/profile/WithdrawButton";

const statusStyles: Record<string, string> = {
  PENDING: "border-border text-muted-foreground",
  INTERVIEW: "border-brass text-brass",
  HIRED: "border-verdigris text-verdigris",
  REJECTED: "border-cinnabar text-cinnabar",
  WITHDRAWN: "border-muted-foreground text-muted-foreground",
};

export function ApplicationCard({ application }: { application: JobApplicationResponse }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-base font-semibold text-foreground">
            {application.jobTitle}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{application.companyName}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Applied {new Date(application.appliedAt).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[10px] ${
            statusStyles[application.status] ?? "border-border text-muted-foreground"
          }`}
        >
          {application.status}
        </span>
      </div>

      {application.status !== "WITHDRAWN" && (
        <div className="mt-3">
          <WithdrawButton applicationId={application.applicationId} />
        </div>
      )}
    </div>
  );
}