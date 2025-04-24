"use server"

import { AuthError } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { redirect } from "next/navigation"
import { createClient } from "@/db/supabase.client"
import { loginSchema } from "@/utils/validations/auth"

export async function login(formData: FormData) {
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
	}

	const validatedFields = loginSchema.safeParse(rawFormData)

	if (!validatedFields.success) {
		return {
			error: "Invalid form data",
			validationErrors: validatedFields.error.flatten().fieldErrors,
		}
	}

	try {
		const { error } = await supabase.auth.signInWithPassword({
			email: validatedFields.data.email,
			password: validatedFields.data.password,
		})

		if (error) {
			if (error instanceof AuthError) {
				return {
					error: "Invalid credentials",
				}
			}
			return {
				error: "An error occurred while signing in",
			}
		}

		revalidatePath("/", "layout")
	} catch {
		return {
			error: "An unexpected error occurred",
		}
	}
}

export async function logout() {
	const supabase = await createClient()
	await supabase.auth.signOut()
}
