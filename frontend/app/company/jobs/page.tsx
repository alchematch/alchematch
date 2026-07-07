import Link from "next/link";
import { getCompanyJobs } from "@/lib/companies";
import { DeleteJobButton } from "@/components/company/DeleteJobButton";
import { JobStatusControl } from "@/components/company/JobStatusControl";

interface CompanyJobsPageProps {
  searchParams: Promise<{ keyword?: string; page?: string }>;
}

export default async function CompanyJobsPage({ searchParams }: CompanyJobsPageProps) {
  const params = await searchParams;
  const data = await getCompanyJobs({ keyword: params.keyword, page: params.page });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-semibold text-foreground">My job listings</h1>
        <Link
          href="/company/jobs/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Post a job
        </Link>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {data.content.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            You haven&apos;t posted any jobs yet.
          </p>
        )}
        {data.content.map((job) => (
          <div key={job.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-heading text-base font-semibold text-foreground">{job.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{job.location}</p>
              </div>
              <JobStatusControl jobId={job.id} status={job.status} />
            </div>
            <div className="mt-3 flex gap-4 text-sm">
              <Link href={`/company/jobs/${job.id}/edit`} className="text-brass hover:underline">
                Edit
              </Link>
              <Link href={`/company/jobs/${job.id}/applicants`} className="text-brass hover:underline">
                View applicants
              </Link>
              <DeleteJobButton jobId={job.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}