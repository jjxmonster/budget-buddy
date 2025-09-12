"use client"

import { DialogTitle } from "@/components/ui/dialog"

export function ChatHeader() {
	return (
		<div className="flex items-center justify-between border-b p-4">
			<DialogTitle className="text-lg font-semibold">Budget Buddy Assistant</DialogTitle>
		</div>
	)
}
