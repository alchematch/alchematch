import { getCompanyProfile } from "@/lib/companies";

export default async function CompanyProfilePage() {
  const profile = await getCompanyProfile();

  if (!profile) {
    return <p className="text-sm text-muted-foreground">Unable to load company profile.</p>;
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-foreground">Company profile</h1>
      <div className="mt-8 rounded-lg border border-border bg-card p-6">
        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Company name</dt>
            <dd className="text-foreground">{profile.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Owner</dt>
            <dd className="text-foreground">{profile.userName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Status</dt>
            <dd className="text-foreground">{profile.enabled ? "Active" : "Disabled"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}