"use server"

import { AuthError } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/db/supabase.client"
import { registerSchema } from "@/lib/validations/auth"

export async function register(formData: FormData) {
	const supabase = await createClient()
	const {
		data: { session },
	} = await supabase.auth.getSession()

	if (session) {
		redirect("/dashboard/expenses")
	}
	const rawFormData = {
		email: formData.get("email"),
		password: formData.get("password"),
		confirmPassword: formData.get("confirmPassword"),
	}

	const validatedFields = registerSchema.safeParse(rawFormData)

	if (!validatedFields.success) {
		return {
			error: "Invalid form data",
			validationErrors: validatedFields.error.flatten().fieldErrors,
		}
	}

	try {
		const { error } = await supabase.auth.signUp({
			email: validatedFields.data.email,
			password: validatedFields.data.password,
		})

		if (error) {
			if (error instanceof AuthError) {
				return {
					error: "This email is already registered",
				}
			}
			return {
				error: "An error occurred while signing up",
			}
		}

		revalidatePath("/", "layout")
	} catch {
		return {
			error: "An unexpected error occurred",
		}
	}
}
