import { notFound } from "next/navigation";
import { getCompanyJobs } from "@/lib/companies";
import { JobForm } from "@/components/company/JobForm";

interface EditJobPageProps {
  params: Promise<{ jobId: string }>;
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { jobId } = await params;

  const data = await getCompanyJobs({ page: "0", size: "100" });
  const job = data.content.find((j) => String(j.id) === jobId);

  if (!job) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-foreground">Edit job</h1>
      <div className="mt-8 max-w-xl rounded-lg border border-border bg-card p-6">
        <JobForm
          jobId={job.id}
          defaultValues={{
            title: job.title,
            description: job.description,
            employmentType: job.employmentType,
            tagline: job.tagline ?? "",
            level: job.level ?? "",
            payMin: job.payMin ?? undefined,
            payMax: job.payMax ?? undefined,
            payPeriod: job.payPeriod ?? undefined,
            payType: job.payType ?? undefined,
            location: job.location ?? "",
            benefits: job.benefits?.join("\n") ?? "",
            minimumRequirements: job.minimumRequirements?.join("\n") ?? "",
          }}
        />
      </div>
    </div>
  );
}