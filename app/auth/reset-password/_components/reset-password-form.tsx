"use client"

import Link from "next/link"
import * as React from "react"
import { AuthForm } from "@/components/auth/auth-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ResetPasswordForm() {
	return (
		<AuthForm
			title="Reset Password"
			description="Enter your email address and we'll send you a password reset link"
			footer={
				<div className="text-center text-sm">
					<Link href="/auth/login" className="text-muted-foreground hover:text-primary hover:underline">
						Back to Sign In
					</Link>
				</div>
			}
		>
			<form className="space-y-4">
				<div className="space-y-2">
					<Input id="email" name="email" type="email" placeholder="Email" required autoComplete="email" autoFocus />
				</div>
				<Button type="submit" className="w-full">
					Send Reset Link
				</Button>
			</form>
		</AuthForm>
	)
}
