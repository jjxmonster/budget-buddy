"use client"

import Link from "next/link"
import * as React from "react"
import { AuthForm } from "@/components/auth/auth-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function RegisterForm() {
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
						autoComplete="new-password"
					/>
				</div>
				<div className="space-y-2">
					<Input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						placeholder="Confirm Password"
						required
						autoComplete="new-password"
					/>
				</div>
				<Button type="submit" className="w-full">
					Sign Up
				</Button>
			</form>
		</AuthForm>
	)
}
