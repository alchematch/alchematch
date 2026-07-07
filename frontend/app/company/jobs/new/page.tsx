import { JobForm } from "@/components/company/JobForm";

export default function NewJobPage() {
  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-foreground">Post a job</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Degree field eligibility isn&apos;t set here yet — jobs are open to all candidates until that&apos;s wired up.
      </p>
      <div className="mt-8 max-w-xl rounded-lg border border-border bg-card p-6">
        <JobForm />
      </div>
    </div>
  );
}