import { EmploymentType, PayPeriod, PayType } from "./job";

export interface SavedJobResponse {
  savedJobId: number;
  jobId: number;
  title: string;
  tagline: string | null;
  employmentType: EmploymentType;
  level: string | null;
  payMin: number | null;
  payMax: number | null;
  payPeriod: PayPeriod | null;
  payType: PayType | null;
  location: string | null;
  status: string;
  companyName: string;
}

export interface SavedJobPageResponse {
  content: SavedJobResponse[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}