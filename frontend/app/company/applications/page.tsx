import { getCompanyJobApplications } from "@/lib/companyJobApplications";
import { getActiveDegreeFields } from "@/lib/degreeFields";
import { CompanyApplicationCard } from "@/components/company/CompanyApplicationCard";
import { CompanyApplicationsFilter } from "@/components/company/CompanyApplicationsFilter";
import { Pagination } from "@/components/ui/pagination";

interface CompanyApplicationsPageProps {
  searchParams: Promise<{
    keyword?: string;
    status?: string;
    minYears?: string;
    degreeFieldId?: string;
    educationLevel?: string;
    page?: string;
  }>;
}

export default async function CompanyApplicationsPage({ searchParams }: CompanyApplicationsPageProps) {
  const params = await searchParams;
  const [data, degreeFields] = await Promise.all([
    getCompanyJobApplications(params),
    getActiveDegreeFields(),
  ]);

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-foreground">Applications</h1>

      <div className="mt-6">
        <CompanyApplicationsFilter
          degreeFields={degreeFields}
          defaultValues={{
            keyword: params.keyword,
            status: params.status,
            minYears: params.minYears,
            degreeFieldId: params.degreeFieldId,
            educationLevel: params.educationLevel,
          }}
        />
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {data.totalElements} {data.totalElements === 1 ? "applicant" : "applicants"}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        {data.content.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            No applications match your search.
          </p>
        )}
        {data.content.map((app) => (
          <CompanyApplicationCard key={app.applicationId} app={app} />
        ))}
      </div>

      <div className="mt-6">
        <Pagination
          basePath="/company/applications"
          searchParams={params}
          pageNumber={data.pageNumber}
          totalPages={data.totalPages}
        />
      </div>
    </div>
  );
}