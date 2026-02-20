import { z } from "zod"

// Example validation schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

/** For NEW_PASSWORD_REQUIRED challenge: new password + required attributes (e.g. given_name, family_name). */
export const newPasswordRequiredSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmNewPassword: z.string().min(8, "Password must be at least 8 characters"),
    given_name: z.string().min(1, "Given name is required").optional(),
    family_name: z.string().min(1, "Family name is required").optional(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type NewPasswordRequiredInput = z.infer<typeof newPasswordRequiredSchema>

