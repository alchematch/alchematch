import { requireUser } from "@/lib/authGuard";
import { getMyCompanyApplication } from "@/lib/companyApplications";
import { ApplyCompanyForm } from "@/components/company/ApplyCompanyForm";

export default async function ApplyCompanyPage() {
  const user = await requireUser();

  if (user.companyApplicationStatus === "PENDING" || user.companyApplicationStatus === "APPROVED") {
    const application = await getMyCompanyApplication();

    return (
      <div>
        <h1 className="font-heading text-3xl font-semibold text-foreground">
          Apply to become a company
        </h1>
        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            {user.companyApplicationStatus === "PENDING" ? "Under review" : "Approved"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {user.companyApplicationStatus === "PENDING"
              ? "Your application is being reviewed."
              : "Your application has been approved."}
          </p>
          {application && (
            <dl className="mt-4 flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Company name</dt>
                <dd className="text-foreground">{application.companyName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Submitted</dt>
                <dd className="text-foreground">
                  {new Date(application.createdDate).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-foreground">
        Apply to become a company
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {user.companyApplicationStatus === "REJECTED"
          ? "Your previous application wasn't approved. You can submit a new one below."
          : "Submit your company details for review. Once approved, you'll be able to post and manage job listings."}
      </p>
      <div className="mt-8 max-w-md rounded-lg border border-border bg-card p-6">
        <ApplyCompanyForm />
      </div>
    </div>
  );
}