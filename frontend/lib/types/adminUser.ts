export interface AdminUserResponse {
  userId: number;
  username: string;
  email: string;
  role: string;
  enabled: boolean;
  accountNonLocked: boolean;
  createdDate: string;
}

export interface AdminUserPageResponse {
  content: AdminUserResponse[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}