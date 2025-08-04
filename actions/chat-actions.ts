"use server"

import { revalidatePath } from "next/cache"
import { processAIAssistantMessage, recordAssistantFeedback } from "@/actions/ai-assistant-actions"
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

		// Process the message
		const response = await processAIAssistantMessage(userMessage, serviceMessages, false, apiKey)

		console.log("response", response)

		// Return the message in the format expected by the UI
		return {
			success: true,
			message: {
				id: Math.floor(Math.random() * 1000000), // This would normally be the feedback ID from DB
				role: "assistant" as const,
				content: response.content,
				error: response.error,
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
		const result = await recordAssistantFeedback(messageId, isPositive ? 1 : -1)
		revalidatePath("/dashboard/expenses")
		return { success: result.success }
	} catch (error) {
		console.error("Error submitting feedback:", error)
		return { success: false }
	}
}
