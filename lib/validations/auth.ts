import * as z from "zod"

export const loginSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
})

export const registerSchema = z
	.object({
		email: z.string().email("Please enter a valid email address"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
