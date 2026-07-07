export type JobApplicationStatus = "PENDING" | "INTERVIEW" | "HIRED" | "REJECTED" | "WITHDRAWN";

export interface JobApplicationResponse {
  applicationId: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  status: JobApplicationStatus;
  appliedAt: string;
}