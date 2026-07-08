import { requireRole } from "@/lib/authGuard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

const tabs = [
  { label: "Company profile", href: "/company" },
  { label: "My job listings", href: "/company/jobs" },
  { label: "Applications", href: "/company/applications" },
  { label: "Post a job", href: "/company/jobs/new" },
];

export default async function CompanyLayout({ children }: { children: React.ReactNode }) {
  await requireRole("ROLE_COMPANY");
  return <DashboardShell tabs={tabs}>{children}</DashboardShell>;
}