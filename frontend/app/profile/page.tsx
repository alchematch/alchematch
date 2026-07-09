import { requireUser } from "@/lib/authGuard";
import { getMyCompanyApplication } from "@/lib/companyApplications";
import { ProfileOverview } from "@/components/profile/ProfileOverview";

export default async function ProfilePage() {
  const user = await requireUser();
  const companyApplication = await getMyCompanyApplication();
  console.log("DEBUG companyApplication:", companyApplication);

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-foreground">
        Your profile
      </h1>
      <div className="mt-8">
        <ProfileOverview user={user} companyApplication={companyApplication} />
      </div>
    </div>
  );
}