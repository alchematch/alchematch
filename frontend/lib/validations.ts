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
});
export type JobFormInput = z.infer<typeof jobFormSchema>;