"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { redirect } from "next/navigation"
import * as React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { AuthForm } from "@/components/auth/auth-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { type RegisterFormData, registerSchema } from "@/lib/validations/auth"
import { register } from "../actions"

export function RegisterForm() {
	const form = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	})

	async function onSubmit(data: RegisterFormData) {
		const formData = new FormData()
		formData.append("email", data.email)
		formData.append("password", data.password)
		formData.append("confirmPassword", data.confirmPassword)

		const result = await register(formData)
		console.log(result)
		if (result?.error) {
			toast.error(result.error)
			if (result.validationErrors) {
				Object.entries(result.validationErrors).forEach(([key, messages]) => {
					if (key === "email" || key === "password" || key === "confirmPassword") {
						form.setError(key, {
							message: messages[0],
						})
					}
				})
			}
			return
		}

		redirect("/dashboard/expenses")
	}

	return (
		<AuthForm
			title="Sign Up"
			description="Create a new account by entering your email and password"
			footer={
				<div className="text-center text-sm">
					<p className="text-muted-foreground">
						Already have an account?{" "}
						<Link href="/auth/login" className="text-primary hover:underline">
							Sign In
						</Link>
					</p>
				</div>
			}
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input {...field} type="email" placeholder="Email" autoComplete="email" autoFocus />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input {...field} type="password" placeholder="Password" autoComplete="new-password" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input {...field} type="password" placeholder="Confirm Password" autoComplete="new-password" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting ? "Signing up..." : "Sign Up"}
					</Button>
				</form>
			</Form>
		</AuthForm>
	)
}
