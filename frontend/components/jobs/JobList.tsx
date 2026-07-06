import { JobResponse } from "@/lib/types/job";
import { buildJobsQuery } from "@/lib/utils";
import { JobCard } from "@/components/jobs/JobCard";

export function JobList({
  jobs,
  activeJobId,
  searchParams,
}: {
  jobs: JobResponse[];
  activeJobId: string | undefined;
  searchParams: Record<string, string | undefined>;
}) {
  if (jobs.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No jobs match your search. Try different keywords or filters.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          active={activeJobId === String(job.id)}
          href={`/jobs?${buildJobsQuery(searchParams, { jobId: String(job.id) })}`}
        />
      ))}
    </div>
  );
}