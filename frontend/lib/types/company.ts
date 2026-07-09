export interface CompanyProfileResponse {
  id: number;
  userId: number;
  userName: string;
  name: string;
  enabled: boolean;
}

export type CompanyApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AdminCompanyApplicationResponse {
  applicationId: number;
  applicantUserId: number;
  applicantUsername: string;
  applicantEmail: string;
  documentUrl: string;
  companyName: string;
  status: CompanyApplicationStatus;
  appliedAt: string;
  rejectionReason: string | null;
}

export interface AdminCompanyApplicationPageResponse {
  content: AdminCompanyApplicationResponse[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export type JobApplicationStatus = "PENDING" | "INTERVIEW" | "HIRED" | "REJECTED" | "WITHDRAWN";

export interface CompanyJobApplicationRowResponse {
  applicationId: number;
  jobId: number;
  jobTitle: string;
  applicantUserId: number;
  applicantUsername: string;
  applicantEmail: string;
  resumeUrl: string | null;
  educationLevel: string | null;
  degreeFieldId: number | null;
  degreeFieldName: string | null;
  yearsExperience: number | null;
  location: string | null;
  status: JobApplicationStatus;
  appliedAt: string;
}

export interface CompanyJobApplicationPageResponse {
  content: CompanyJobApplicationRowResponse[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}