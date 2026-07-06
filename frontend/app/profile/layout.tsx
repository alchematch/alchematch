import { requireRole } from "@/lib/authGuard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

const tabs = [
  { label: "Overview", href: "/profile" },
  { label: "Candidate profile", href: "/profile/candidate-profile" },
  { label: "My applications", href: "/profile/applications" },
  { label: "Saved jobs", href: "/profile/saved-jobs" },
  { label: "Apply to become a company", href: "/profile/apply-company" },
];

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Candidate-only dashboard. Company and admin roles get their own
  // dashboards (/company, /admin) later, reusing this same DashboardShell
  // with a different tab list — the shell itself is role-agnostic.
  await requireRole("ROLE_USER");

  return <DashboardShell tabs={tabs}>{children}</DashboardShell>;
}