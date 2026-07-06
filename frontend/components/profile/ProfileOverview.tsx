import { UserResponse } from "@/lib/types/user";

export function ProfileOverview({ user }: { user: UserResponse }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Account</h2>
        <dl className="mt-4 flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Username</dt>
            <dd className="text-foreground">{user.username}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="text-foreground">{user.email}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Company application status
        </h2>
        {user.companyApplicationStatus === "PENDING" && (
          <p className="mt-2 text-sm text-muted-foreground">
            Your application to become a company is under review.
          </p>
        )}
        {user.companyApplicationStatus === "REJECTED" && (
          <p className="mt-2 text-sm text-muted-foreground">
            Your previous application wasn&apos;t approved. You can apply again from the sidebar.
          </p>
        )}
        {!user.companyApplicationStatus && (
          <p className="mt-2 text-sm text-muted-foreground">
            You haven&apos;t applied to become a company yet.
          </p>
        )}
      </div>
    </div>
  );
}