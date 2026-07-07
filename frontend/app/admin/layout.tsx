import { requireRole } from "@/lib/authGuard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

const tabs = [
  { label: "Company applications", href: "/admin" },
  { label: "User moderation", href: "/admin/moderation" },
  { label: "Degree fields", href: "/admin/degree-fields" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]);
  return <DashboardShell tabs={tabs}>{children}</DashboardShell>;
}