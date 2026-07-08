import { getMySavedJobs } from "@/lib/savedJobs";
import { SavedJobCard } from "@/components/profile/SavedJobCard";
import { SavedJobsFilter } from "@/components/profile/SavedJobsFilter";
import { Pagination } from "@/components/ui/pagination";

interface SavedJobsPageProps {
  searchParams: Promise<{ keyword?: string; page?: string }>;
}

export default async function SavedJobsPage({ searchParams }: SavedJobsPageProps) {
  const params = await searchParams;
  const data = await getMySavedJobs(params);

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-foreground">Saved jobs</h1>

      <div className="mt-6">
        <SavedJobsFilter defaultValues={{ keyword: params.keyword }} />
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {data.totalElements} {data.totalElements === 1 ? "job" : "jobs"} saved
      </p>

      <div className="mt-4 flex flex-col gap-3">
        {data.content.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            You haven&apos;t saved any jobs yet.
          </p>
        )}
        {data.content.map((job) => (
          <SavedJobCard key={job.savedJobId} job={job} />
        ))}
      </div>

      <div className="mt-6">
        <Pagination
          basePath="/profile/saved-jobs"
          searchParams={params}
          pageNumber={data.pageNumber}
          totalPages={data.totalPages}
        />
      </div>
    </div>
  );
}