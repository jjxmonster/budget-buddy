"use client"

import Link from "next/link"
import * as React from "react"
import { AuthForm } from "@/components/auth/auth-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function LoginForm() {
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
			<form className="space-y-4">
				<div className="space-y-2">
					<Input id="email" name="email" type="email" placeholder="Email" required autoComplete="email" autoFocus />
				</div>
				<div className="space-y-2">
					<Input
						id="password"
						name="password"
						type="password"
						placeholder="Password"
						required
						autoComplete="current-password"
					/>
				</div>
				<Button type="submit" className="w-full">
					Sign In
				</Button>
			</form>
		</AuthForm>
	)
}
