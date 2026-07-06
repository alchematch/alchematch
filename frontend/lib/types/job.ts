export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERN"
  | "TEMPORARY"
  | "REMOTE";

export const employmentTypeLabels: Record<EmploymentType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERN: "Internship",
  TEMPORARY: "Temporary",
  REMOTE: "Remote",
};

export type PayType = "SALARY" | "HOURLY" | "CONTRACT" | "COMMISSION";
export type PayPeriod = "HOUR" | "MONTH" | "YEAR";

export interface JobResponse {
  id: number;
  title: string;
  description: string;
  tagline: string | null;
  employmentType: EmploymentType;
  level: string | null;
  payMin: number | null;
  payMax: number | null;
  payPeriod: PayPeriod | null;
  payType: PayType | null;
  location: string;
  benefits: string[];
  minimumRequirements: string[];
  // degreeFields intentionally omitted — DegreeField entity shape not confirmed yet
  status: string;
  companyName: string;
  createdAt: string;
}

export interface JobPageResponse {
  content: JobResponse[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface JobSearchParams {
  keyword?: string;
  employmentType?: EmploymentType;
  minPay?: string;
  maxPay?: string;
  location?: string;
  from?: string;
  to?: string;
  page?: string;
}