import { getPublishedJobs, getPublishedJobById } from "@/lib/jobs";
import { buildJobsQuery } from "@/lib/utils";
import { JobList } from "@/components/jobs/JobList";
import { JobDetailPane } from "@/components/jobs/JobDetailPane";
import { JobFilters } from "@/components/jobs/JobFilters";
import Link from "next/link";
import type { EmploymentType, JobResponse } from "@/lib/types/job";
import { JobFiltersSidebar } from "@/components/jobs/JobFiltersSidebar";

interface JobsPageProps {
  searchParams: Promise<{
    keyword?: string;
    employmentType?: string;
    location?: string;
    minPay?: string;
    maxPay?: string;
    from?: string;
    to?: string;
    page?: string;
    jobId?: string;
  }>;
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;

  const data = await getPublishedJobs({
    keyword: params.keyword,
    employmentType: params.employmentType as EmploymentType | undefined,
    location: params.location,
    minPay: params.minPay,
    maxPay: params.maxPay,
    from: params.from,
    to: params.to,
    page: params.page,
  });

  let selectedJob: JobResponse | null = null;
  if (params.jobId) {
    try {
      selectedJob = await getPublishedJobById(Number(params.jobId));
    } catch {
      selectedJob = null;
    }
  }

  return (
    <div className="px-6 py-10 sm:px-10 lg:px-16 xl:px-24">
      <h1 className="font-heading text-3xl font-semibold text-foreground">
        Find your next role
      </h1>

      <div className="mt-6">
        <JobFilters
          defaultValues={{
            keyword: params.keyword,
            employmentType: params.employmentType,
            location: params.location,
            minPay: params.minPay,
            maxPay: params.maxPay,
            from: params.from,
            to: params.to,
          }}
        />
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {data.totalElements} {data.totalElements === 1 ? "job" : "jobs"} found
      </p>

      <div className="mt-4 lg:grid lg:grid-cols-[260px_380px_1fr] lg:gap-6 lg:items-start">
        <div className="hidden h-[calc(100vh-14rem)] overflow-y-auto rounded-lg border border-border bg-card p-4 lg:block">
          <JobFiltersSidebar
            defaultValues={{
              keyword: params.keyword,
              employmentType: params.employmentType,
              location: params.location,
              minPay: params.minPay,
              maxPay: params.maxPay,
              from: params.from,
              to: params.to,
            }}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-[calc(100vh-18rem)] overflow-y-auto rounded-lg border border-border bg-card p-4">
            <JobList jobs={data.content} activeJobId={params.jobId} searchParams={params} />
          </div>

          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              {Number(params.page ?? 0) > 0 && (
                <Link
                  href={`/jobs?${buildJobsQuery(params, { page: String(Number(params.page ?? 0) - 1) })}`}
                  className="text-sm text-brass hover:underline"
                >
                  ← Previous
                </Link>
              )}
              <span className="text-sm text-muted-foreground">
                Page {data.pageNumber + 1} of {data.totalPages}
              </span>
              {!data.last && (
                <Link
                  href={`/jobs?${buildJobsQuery(params, { page: String(Number(params.page ?? 0) + 1) })}`}
                  className="text-sm text-brass hover:underline"
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="h-[calc(100vh-18rem)] overflow-y-auto rounded-lg border border-border bg-card">
          <JobDetailPane job={selectedJob} />
        </div>
      </div>
    </div>
  );
}