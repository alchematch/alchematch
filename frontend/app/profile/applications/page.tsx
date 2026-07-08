import { getMyApplications } from "@/lib/jobApplications";
import { ApplicationCard } from "@/components/profile/ApplicationCard";
import { ApplicationsFilter } from "@/components/profile/ApplicationsFilter";
import { Pagination } from "@/components/ui/pagination";

interface MyApplicationsPageProps {
  searchParams: Promise<{ keyword?: string; status?: string; page?: string }>;
}

export default async function MyApplicationsPage({ searchParams }: MyApplicationsPageProps) {
  const params = await searchParams;
  const data = await getMyApplications(params);

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-foreground">My applications</h1>

      <div className="mt-6">
        <ApplicationsFilter defaultValues={{ keyword: params.keyword, status: params.status }} />
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {data.totalElements} {data.totalElements === 1 ? "application" : "applications"}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        {data.content.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            No applications match your search.
          </p>
        )}
        {data.content.map((app) => (
          <ApplicationCard key={app.applicationId} application={app} />
        ))}
      </div>

      <div className="mt-6">
        <Pagination
          basePath="/profile/applications"
          searchParams={params}
          pageNumber={data.pageNumber}
          totalPages={data.totalPages}
        />
      </div>
    </div>
  );
}