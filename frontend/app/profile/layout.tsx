import { requireRole } from "@/lib/authGuard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

const tabs = [
  { label: "Overview", href: "/profile" },
  { label: "Candidate profile", href: "/profile/candidate-profile" },
  { label: "My applications", href: "/profile/applications" },
  { label: "Saved jobs", href: "/profile/saved-jobs" },
  { label: "Apply to become a company", href: "/profile/apply-company" },
  { label: "Account settings", href: "/profile/settings" },
];

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("ROLE_USER");

  return <DashboardShell tabs={tabs}>{children}</DashboardShell>;
}