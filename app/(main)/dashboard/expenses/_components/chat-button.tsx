"use client"

import { MessageCircle } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChatDialog } from "./chat-dialog"

export function ChatButton() {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<>
			<Button
				className="fixed right-6 bottom-6 z-50 rounded-full shadow-lg"
				size="icon"
				onClick={() => setIsOpen(true)}
				aria-label="Open chat assistant"
			>
				<MessageCircle className="h-5 w-5" />
			</Button>

			<ChatDialog open={isOpen} onCloseAction={() => setIsOpen(false)} />
		</>
	)
}
