import { getAdminCompanyApplications } from "@/lib/adminCompanyApplications";
import { CompanyApplicationsTable } from "@/components/admin/CompanyApplicationsTable";
import { Pagination } from "@/components/ui/pagination";

interface AdminPageProps {
  searchParams: Promise<{ status?: string; keyword?: string; page?: string }>;
}

export default async function AdminCompanyApplicationsPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const data = await getAdminCompanyApplications(params);

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-foreground">
        Company applications
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{data.totalElements} total</p>
      <div className="mt-6">
        <CompanyApplicationsTable applications={data.content} />
      </div>
      <div className="mt-6">
        <Pagination
          basePath="/admin"
          searchParams={params}
          pageNumber={data.pageNumber}
          totalPages={data.totalPages}
        />
      </div>
    </div>
  );
}