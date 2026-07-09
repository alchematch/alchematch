import { getCurrentUser } from "@/lib/auth";
import { AccountSettingsForm } from "@/components/account/AccountSettingsForm";

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-foreground">
        Account settings
      </h1>
      <div className="mt-8">
        <AccountSettingsForm currentUsername={user.username} currentEmail={user.email} />
      </div>
    </div>
  );
}