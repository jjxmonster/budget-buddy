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
import { type LoginFormData, loginSchema } from "@/lib/validations/auth"
import { login } from "../actions"

export function LoginForm() {
	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	})

	async function onSubmit(data: LoginFormData) {
		const formData = new FormData()
		formData.append("email", data.email)
		formData.append("password", data.password)

		const result = await login(formData)

		if (result?.error) {
			toast.error(result.error)
			if (result.validationErrors) {
				Object.entries(result.validationErrors).forEach(([key, messages]) => {
					if (key === "email" || key === "password") {
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
			title="Sign In"
			description="Enter your email and password to sign in to your account"
			footer={
				<div className="text-center text-sm">
					<p className="text-muted-foreground">
						Don't have an account?{" "}
						<Link href="/auth/register" className="text-primary hover:underline">
							Sign Up
						</Link>
					</p>
					<Link
						href="/auth/reset-password"
						className="text-muted-foreground hover:text-primary mt-2 inline-block text-sm hover:underline"
					>
						Forgot your password?
					</Link>
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
									<Input {...field} type="password" placeholder="Password" autoComplete="current-password" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting ? "Signing in..." : "Sign In"}
					</Button>
				</form>
			</Form>
		</AuthForm>
	)
}
