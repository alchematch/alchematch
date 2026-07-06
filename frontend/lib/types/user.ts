export type AppRole = "ROLE_USER" | "ROLE_COMPANY" | "ROLE_SUPER_ADMIN" | "ROLE_ADMIN";

export const roleLabels: Record<AppRole, string> = {
  ROLE_USER: "Candidate",
  ROLE_COMPANY: "Company",
  ROLE_SUPER_ADMIN: "Super Admin",
  ROLE_ADMIN: "Admin",
};

export type CompanyApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface UserResponse {
  userId: number;
  username: string;
  email: string;
  role: string;
  enabled: boolean;
  companyApplicationStatus: CompanyApplicationStatus | null;
}

export interface CompanyApplicationResponse {
  id: number;
  companyName: string;
  status: string;
  documentUrl: string;
  createdDate: string;
}