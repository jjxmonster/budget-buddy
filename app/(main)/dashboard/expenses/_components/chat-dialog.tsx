"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Loader2, Send, ThumbsDown, ThumbsUp } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/utils/helpers"

interface ChatDialogProps {
	open: boolean
	onClose: () => void
}

export function ChatDialog({ open, onClose }: ChatDialogProps) {
	const [apiKey, setApiKey] = useState("")
	const [input, setInput] = useState("")

	const { messages, sendMessage, status } = useChat({
		transport: new DefaultChatTransport({
			api: "/api/chat",
			body: {
				apiKey: apiKey || undefined,
			},
		}),
		messages: [
			{
				id: "1",
				role: "assistant",
				parts: [
					{
						type: "text",
						text: "Hello! I'm your Budget Buddy assistant. How can I help you with your finances today?",
					},
				],
			},
		],
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!input.trim() || status !== "ready") return

		sendMessage({ text: input })
		setInput("")
	}

	const handleFeedback = async (messageId: string, isPositive: boolean) => {
		// For now, just log the feedback since we need to integrate with the existing feedback system
		// In a full implementation, you'd need to map the message ID to the feedback system
		console.log(`Feedback for message ${messageId}: ${isPositive ? "positive" : "negative"}`)

		// You could extend this to work with the existing submitFeedback function
		// by storing a mapping between useChat message IDs and your database IDs
	}

	return (
		<Dialog open={open} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="flex h-[600px] flex-col gap-0 p-0 sm:max-w-md">
				<div className="flex items-center justify-between border-b p-4">
					<DialogTitle className="text-lg font-semibold">Budget Buddy Assistant</DialogTitle>
				</div>

				<div className="bg-muted/50 border-b p-4">
					<div className="space-y-2">
						<Label htmlFor="api-key" className="text-sm font-medium">
							OpenRouter API Key
						</Label>
						<Input
							id="api-key"
							type="password"
							value={apiKey}
							onChange={(e) => setApiKey(e.target.value)}
							placeholder="sk-or-v1-..."
							className="text-sm"
						/>
						<p className="text-muted-foreground text-xs">Provide your own OpenRouter API key.</p>
					</div>
				</div>

				<div className="flex-1 space-y-4 overflow-y-auto p-4">
					{messages.map((message) => (
						<div
							key={message.id}
							className={cn(
								"max-w-[80%] rounded-lg",
								// @ts-expect-error TypeScript false positive on role comparison
								message.role === "user" ? "bg-primary text-primary-foreground ml-auto p-3" : "mr-auto"
							)}
						>
							{status === "streaming" && message.role === "assistant" && !message.parts?.[0]?.text ? (
								<div className="bg-muted flex space-x-2 p-3">
									<Loader2 className="h-4 w-4 animate-spin" />
									<span>Thinking...</span>
								</div>
							) : (
								<div className="flex flex-col">
									<div className={cn("p-3", message.role === "assistant" && "bg-muted")}>
										{message.parts?.map((part, index) =>
											part.type === "text" ? <span key={index}>{part.text}</span> : null
										)}
									</div>

									{message.role === "assistant" && message.parts?.[0]?.type === "text" && message.parts[0].text && (
										<div className="flex justify-end space-x-2 p-2">
											<span className="text-muted-foreground mr-2 text-xs">Was this helpful?</span>
											<Button
												variant="ghost"
												size="icon"
												className="h-6 w-6"
												onClick={() => handleFeedback(message.id, true)}
											>
												<ThumbsUp className="h-3 w-3" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="h-6 w-6"
												onClick={() => handleFeedback(message.id, false)}
											>
												<ThumbsDown className="h-3 w-3" />
											</Button>
										</div>
									)}
								</div>
							)}
						</div>
					))}
				</div>

				<form onSubmit={handleSubmit} className="border-t p-4">
					<div className="flex gap-2">
						<Input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="Type your message..."
							className="flex-1"
							disabled={status !== "ready"}
						/>
						<Button type="submit" disabled={status !== "ready" || !input.trim()}>
							{status === "streaming" || status === "submitted" ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Send className="h-4 w-4" />
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
