"use server"

import { revalidatePath } from "next/cache"
import { Message } from "@/types/openrouter.types"

export type ChatMessage = {
	id?: number
	role: "user" | "assistant" | "system"
	content: string
	isLoading?: boolean
	needsFeedback?: boolean
	error?: string
}

/**
 * Server action to send a message to the AI assistant
 */
export async function sendChatMessage(userMessage: string, chatHistory: ChatMessage[], apiKey?: string) {
	try {
		// Convert UI chat messages to the format expected by the AI service
		const serviceMessages: Message[] = chatHistory
			.filter((msg) => !msg.isLoading && (msg.role === "user" || msg.role === "assistant"))
			.map((msg) => ({
				role: msg.role as "user" | "assistant" | "system",
				content: msg.content,
			}))

		// Add the new user message
		serviceMessages.push({
			role: "user",
			content: userMessage,
		})

		// Call our chat API route
		const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/chat`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				messages: serviceMessages,
				apiKey: apiKey,
			}),
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
		}

		// Handle streaming response
		const reader = response.body?.getReader()
		if (!reader) {
			throw new Error("No response body")
		}

		let content = ""
		const decoder = new TextDecoder()

		try {
			while (true) {
				const { done, value } = await reader.read()
				if (done) break

				const chunk = decoder.decode(value, { stream: true })
				content += chunk
			}
		} finally {
			reader.releaseLock()
		}

		// Return the message in the format expected by the UI
		return {
			success: true,
			message: {
				id: Math.floor(Math.random() * 1000000),
				role: "assistant" as const,
				content: content,
				needsFeedback: true,
			},
		}
	} catch (error) {
		console.error("Error sending chat message:", error)
		return {
			success: false,
			message: {
				role: "assistant" as const,
				content: "Sorry, I encountered an error processing your request. Please try again.",
				error: error instanceof Error ? error.message : "Unknown error",
			},
		}
	}
}

/**
 * Server action to record user feedback on an AI response
 */
export async function submitFeedback(messageId: number, isPositive: boolean) {
	try {
		// For now, just log the feedback - you can implement database storage later
		console.log(`Feedback received for message ${messageId}: ${isPositive ? "positive" : "negative"}`)
		revalidatePath("/dashboard/expenses")
		return { success: true }
	} catch (error) {
		console.error("Error submitting feedback:", error)
		return { success: false }
	}
}
