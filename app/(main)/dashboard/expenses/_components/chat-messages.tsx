"use client"

import { Loader2, ThumbsDown, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/helpers"

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

interface ChatMessagesProps {
	messages: Array<{ id: string; role: "user" | "assistant"; parts?: MessagePart[] }>
	status: "ready" | "submitted" | "streaming" | "error"
	onFeedback: (messageId: string, isPositive: boolean) => void
}

export function ChatMessages({ messages, status, onFeedback }: ChatMessagesProps) {
	return (
		<div className="flex-1 space-y-4 overflow-y-auto p-4">
			{messages.map((message) => (
				<div key={message.id} className={cn("max-w-[80%] space-y-2", message.role === "user" ? "ml-auto" : "mr-auto")}>
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
													<span className="text-sm text-yellow-800">Executing {part.toolInvocation.toolName}...</span>
												</div>
											</div>
										)
									case "result":
										return (
											<div key={index} className="rounded-lg border border-green-200 bg-green-50 p-3">
												<div className="text-sm text-green-800">
													<strong>{part.toolInvocation.toolName} completed</strong>
													{part.toolInvocation.result && (
														<div className="mt-1 text-xs">
															{(() => {
																const res = part.toolInvocation?.result as Record<string, unknown>
																if (res?.success === false && res?.error) {
																	return <span className="text-red-700">Error: {String(res.error)}</span>
																}
																if (res?.message) {
																	return <span className="text-green-700">{String(res.message)}</span>
																}
																if (Array.isArray(res?.data)) {
																	return <span className="text-green-700">Found {res.data.length} item(s)</span>
																}
																return null
															})()}
														</div>
													)}
												</div>
											</div>
										)
									default:
										return null
								}
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
							<Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onFeedback(message.id, true)}>
								<ThumbsUp className="h-3 w-3" />
							</Button>
							<Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onFeedback(message.id, false)}>
								<ThumbsDown className="h-3 w-3" />
							</Button>
						</div>
					)}
				</div>
			))}
			<div />
		</div>
	)
}
