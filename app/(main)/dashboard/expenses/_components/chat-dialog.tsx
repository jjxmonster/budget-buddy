"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai"
import { Loader2, Send, ThumbsDown, ThumbsUp } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/utils/helpers"

interface ChatDialogProps {
	open: boolean
	onClose: () => void
}

interface MessagePart {
	type: string
	text?: string
	toolInvocation?: {
		state: "partial-call" | "call" | "result"
		toolName: string
		toolCallId: string
		args?: Record<string, unknown>
		result?: Record<string, unknown>
	}
}

export function ChatDialog({ open, onClose }: ChatDialogProps) {
	const [apiKey, setApiKey] = useState("")
	const [input, setInput] = useState("")
	const messagesEndRef = useRef<HTMLDivElement>(null)

	const { messages, sendMessage, status, setMessages } = useChat({
		transport: new DefaultChatTransport({
			api: "/api/chat",
			body: {
				apiKey: apiKey || undefined,
			},
		}),
		sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
	})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!input.trim() || status !== "ready") return

		sendMessage({ text: input })
		setInput("")
	}

	const handleFeedback = async (_messageId: string, _isPositive: boolean) => {}

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
	}

	useEffect(() => {
		setMessages([
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
		])
	}, [])

	useEffect(() => {
		scrollToBottom()
	}, [messages])

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
							className={cn("max-w-[80%] space-y-2", message.role === "user" ? "ml-auto" : "mr-auto")}
						>
							{message.parts?.map((part: MessagePart, index) => {
								switch (part.type) {
									case "text":
										return (
											<div
												key={index}
												className={cn(
													"rounded-lg p-3",
													message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
												)}
											>
												<span>{part.text}</span>
											</div>
										)
									case "tool-invocation":
										if (!part.toolInvocation) return null
										switch (part.toolInvocation.state) {
											case "partial-call":
												return (
													<div key={index} className="rounded-lg border border-blue-200 bg-blue-50 p-3">
														<div className="flex items-center space-x-2">
															<Loader2 className="h-3 w-3 animate-spin text-blue-600" />
															<span className="text-sm text-blue-800">Calling {part.toolInvocation.toolName}...</span>
														</div>
													</div>
												)
											case "call":
												return (
													<div key={index} className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
														<div className="flex items-center space-x-2">
															<Loader2 className="h-3 w-3 animate-spin text-yellow-600" />
															<span className="text-sm text-yellow-800">
																Executing {part.toolInvocation.toolName}...
															</span>
														</div>
													</div>
												)
											case "result":
												return (
													<div key={index} className="rounded-lg border border-green-200 bg-green-50 p-3">
														<div className="text-sm text-green-800">
															<strong>{part.toolInvocation.toolName} completed</strong>
															{part.toolInvocation.result && (
																<div className="mt-1 text-xs text-green-600">
																	Found{" "}
																	{Array.isArray((part.toolInvocation.result as Record<string, unknown>)?.data)
																		? ((part.toolInvocation.result as Record<string, unknown>).data as unknown[]).length
																		: 0}{" "}
																	expenses
																</div>
															)}
														</div>
													</div>
												)
											default:
												return null
										}
									default:
										return null
								}
							})}

							{status === "streaming" &&
								message.role === "assistant" &&
								messages.indexOf(message) === messages.length - 1 && (
									<div className="bg-muted rounded-lg p-3">
										<div className="flex items-center space-x-2">
											<Loader2 className="h-4 w-4 animate-spin" />
											<span className="text-sm">Typing...</span>
										</div>
									</div>
								)}

							{message.role === "assistant" && message.parts?.some((part) => part.type === "text" && part.text) && (
								<div className="flex justify-end space-x-2 pt-1">
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
					))}
					<div ref={messagesEndRef} />
				</div>

				<form onSubmit={handleSubmit} className="border-t p-4">
					<div className="flex gap-2">
						<Input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="Type your message..."
							className="flex-1"
							disabled={status === "streaming"}
						/>
						<Button type="submit" disabled={status === "streaming" || !input.trim()}>
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
