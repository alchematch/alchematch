import { getAdminUsers } from "@/lib/adminUsers";
import { UserModerationRow } from "@/components/admin/UserModerationRow";
import { UsersFilter } from "@/components/admin/UsersFilter";
import { Pagination } from "@/components/ui/pagination";

interface AdminModerationPageProps {
  searchParams: Promise<{ keyword?: string; role?: string; page?: string }>;
}

export default async function AdminModerationPage({ searchParams }: AdminModerationPageProps) {
  const params = await searchParams;
  const data = await getAdminUsers(params);

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-foreground">User moderation</h1>

      <div className="mt-6">
        <UsersFilter defaultValues={{ keyword: params.keyword, role: params.role }} />
      </div>

      <p className="mt-6 text-sm text-muted-foreground">{data.totalElements} users</p>

      <div className="mt-4 flex flex-col gap-3">
        {data.content.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">No users match your search.</p>
        )}
        {data.content.map((user) => (
          <UserModerationRow key={user.userId} user={user} />
        ))}
      </div>

      <div className="mt-6">
        <Pagination
          basePath="/admin/moderation"
          searchParams={params}
          pageNumber={data.pageNumber}
          totalPages={data.totalPages}
        />
      </div>
    </div>
  );
}