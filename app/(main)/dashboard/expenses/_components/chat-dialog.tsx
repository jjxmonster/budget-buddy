"use client"

import { Loader2, Send, ThumbsDown, ThumbsUp } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/utils/helpers"
import { ChatMessage, sendChatMessage, submitFeedback } from "../../../../../actions/chat-actions"

interface ChatDialogProps {
	open: boolean
	onClose: () => void
}

export function ChatDialog({ open, onClose }: ChatDialogProps) {
	const [input, setInput] = useState("")
	const [apiKey, setApiKey] = useState("")
	const [messages, setMessages] = useState<ChatMessage[]>([
		{
			role: "assistant",
			content: "Hello! I'm your Budget Buddy assistant. How can I help you with your finances today?",
		},
	])
	const [isLoading, setIsLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!input.trim() || isLoading) return

		// Add user message
		const userMessage: ChatMessage = { role: "user", content: input }
		setMessages((prev) => [...prev, userMessage])
		setInput("")
		setIsLoading(true)

		// Add loading message
		setMessages((prev) => [...prev, { role: "assistant", content: "", isLoading: true }])

		try {
			// Send message to server action
			const response = await sendChatMessage(userMessage.content, messages, apiKey || undefined)

			// Remove the loading message
			setMessages((prev) => prev.filter((msg) => !msg.isLoading))

			// Add response message
			if (response.success) {
				setMessages((prev) => [...prev, response.message])
			} else {
				setMessages((prev) => [
					...prev,
					{
						role: "assistant",
						content: response.message.content,
						error: response.message.error,
					},
				])
			}
		} catch (error) {
			// Remove the loading message
			setMessages((prev) => prev.filter((msg) => !msg.isLoading))

			// Add error message
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: "Sorry, I encountered an error processing your request. Please try again.",
					error: error instanceof Error ? error.message : "Unknown error",
				},
			])
		} finally {
			setIsLoading(false)
		}
	}

	const handleFeedback = async (messageId: number | undefined, isPositive: boolean) => {
		if (!messageId) return

		// Optimistically update UI
		setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, needsFeedback: false } : msg)))

		// Record feedback via server action
		try {
			await submitFeedback(messageId, isPositive)
		} catch (error) {
			console.error("Failed to record feedback:", error)
		}
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
					{messages.map((message, i) => (
						<div
							key={i}
							className={cn(
								"max-w-[80%] rounded-lg",
								message.role === "user" ? "bg-primary text-primary-foreground ml-auto p-3" : "mr-auto"
							)}
						>
							{message.isLoading ? (
								<div className="bg-muted flex space-x-2 p-3">
									<Loader2 className="h-4 w-4 animate-spin" />
									<span>Thinking...</span>
								</div>
							) : (
								<div className="flex flex-col">
									<div className={cn("p-3", message.role === "assistant" && "bg-muted")}>
										{message.content}
										{message.error && <p className="mt-2 text-sm text-red-500">Error: {message.error}</p>}
									</div>

									{message.needsFeedback && (
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
							disabled={isLoading}
						/>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
