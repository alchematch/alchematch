import { JobForm } from "@/components/company/JobForm";
import { getActiveDegreeFields } from "@/lib/degreeFields";

export default async function NewJobPage() {
  const degreeFields = await getActiveDegreeFields();

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-foreground">Post a job</h1>
      <div className="mt-8 max-w-xl rounded-lg border border-border bg-card p-6">
        <JobForm degreeFields={degreeFields} />
      </div>
    </div>
  );
}