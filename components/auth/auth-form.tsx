"use client"

import * as React from "react"
import { cn } from "@/utils/helpers"

interface AuthFormProps extends React.ComponentProps<"div"> {
	title: string
	description: string
	footer?: React.ReactNode
}

export function AuthForm({ title, description, footer, className, children, ...props }: AuthFormProps) {
	return (
		<div className="flex min-h-screen items-center justify-center p-4 md:p-8" {...props}>
			<div className={cn("bg-card w-full max-w-[400px] space-y-6 rounded-xl border p-6 shadow-sm", className)}>
				<div className="space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
					<p className="text-muted-foreground text-sm">{description}</p>
				</div>

				<div className="space-y-4">{children}</div>

				{footer && <div className="pt-4">{footer}</div>}
			</div>
		</div>
	)
}
