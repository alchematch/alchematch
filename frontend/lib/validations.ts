import * as z from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is missing"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;


export const companyApplicationSchema = z.object({
  companyName: z.string().min(1, "Company name is required").max(150),
  documentUrl: z.string().min(1, "This field is required").max(500),
});
export type CompanyApplicationInput = z.infer<typeof companyApplicationSchema>;

export const jobFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required").max(10000),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN", "TEMPORARY", "REMOTE"]),
  tagline: z.string().max(255).optional(),
  level: z.string().max(255).optional(),
  payMin: z.coerce.number().min(0).optional(),
  payMax: z.coerce.number().min(0).optional(),
  payPeriod: z.enum(["HOUR", "MONTH", "YEAR"]).optional(),
  payType: z.enum(["SALARY", "HOURLY", "CONTRACT", "COMMISSION"]).optional(),
  location: z.string().max(255).optional(),
  benefits: z.string().optional(),
  minimumRequirements: z.string().optional(),
  degreeFieldIds: z.array(z.number()).optional(),
});
export type JobFormInput = z.infer<typeof jobFormSchema>;

export const candidateProfileSchema = z.object({
  educationLevel: z
    .enum(["HIGH_SCHOOL", "ASSOCIATE", "BACHELORS", "MASTERS", "DOCTORATE", "OTHER"])
    .optional(),
  degreeFieldId: z.coerce.number().optional(),
  yearsExperience: z.coerce
    .number()
    .min(0, "yearsExperience must be 0 or greater")
    .optional(),
  phone: z.string().max(30, "phone must be 30 characters or fewer").optional(),
  location: z.string().max(120, "location must be 120 characters or fewer").optional(),
});
export type CandidateProfileInput = z.infer<typeof candidateProfileSchema>;

export const resumeUrlSchema = z.object({
  resumeUrl: z
    .string()
    .min(1, "Resume link is required")
    .max(500, "resumeUrl must be 500 characters or fewer"),
});
export type ResumeUrlInput = z.infer<typeof resumeUrlSchema>;

export const degreeFieldSchema = z.object({
  name: z.string().min(1, "Name is required"),
});
export type DegreeFieldInput = z.infer<typeof degreeFieldSchema>;

export const companyApplicationFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required").max(150),
  businessName: z.string().min(1, "Legal business name is required").max(200),
  licenseNumber: z.string().min(1, "License/registration number is required").max(100),
  businessAddress: z.string().min(1, "Business address is required").max(300),
  registrationJurisdiction: z.string().min(1, "Registration jurisdiction is required").max(150),
  phone: z.string().min(1, "Phone number is required").max(30),
  isoCertification: z.string().max(150).optional(),
});
export type CompanyApplicationFormInput = z.infer<typeof companyApplicationFormSchema>;

export const changeUsernameSchema = z.object({
  username: z.string().min(1, "Username is required").max(100),
});
export type ChangeUsernameInput = z.infer<typeof changeUsernameSchema>;

export const changeEmailSchema = z.object({
  email: z.string().email("Enter a valid email address").max(50),
});
export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters").max(72),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;