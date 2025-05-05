"use server"

import { Message } from "@/types/openrouter.types"
import { OpenRouterService } from "./openrouter.service"

/**
 * Generates a chat response using the OpenRouter API
 *
 * @param userMessage - The message from the user
 * @param chatHistory - Previous messages in the conversation
 * @returns The AI assistant's response
 */
export async function generateChatResponse(userMessage: string, chatHistory: { role: string; content: string }[] = []) {
	// Check for API key in environment variables
	const apiKey = process.env.OPENROUTER_API_KEY
	if (!apiKey) {
		throw new Error("OpenRouter API key is not configured")
	}

	const openRouter = new OpenRouterService(apiKey)

	try {
		// Format chat history to proper Message type
		const typedChatHistory: Message[] = chatHistory.map((msg) => ({
			role: msg.role as "system" | "user" | "assistant",
			content: msg.content,
		}))

		// System message for providing context to the AI
		const systemMessage =
			"You are a helpful financial assistant for Budget Buddy app. Provide clear, concise advice about budgeting and finances."

		// Send the request to OpenRouter and return the response
		return await openRouter.sendChatCompletion(userMessage, systemMessage, typedChatHistory)
	} catch (error) {
		console.error("Error generating chat response:", error)
		throw new Error("Failed to generate response. Please try again later.")
	}
}
