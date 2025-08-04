"use server"

import { streamText } from "ai"
import { revalidatePath } from "next/cache"
import { env } from "@/env.mjs"
import { openrouter } from "@/services/ai-agent.service"
import { Message } from "@/types/openrouter.types"
import getTools from "@/utils/ai-tools"
import { AIAgentsService } from "../services/ai-agents.service"
import { getCurrentUser, getServiceClient } from "../services/supabase.service"

// Define return type for the chat response
export type ChatResponse = {
	content: string
	error?: string
	moderationResult?: { isRelevant: boolean; reason: string }
	debugInfo?: {
		query?: string
		queryValidation?: { isValid: boolean; error?: string }
		resultsCount?: number
	}
}

/**
 * Record feedback for the AI assistant's response
 */
export async function recordAssistantFeedback(questionId: number, rating: number) {
	try {
		const supabase = await getServiceClient()

		await supabase.from("feedback").update({ rating }).eq("id", questionId)

		revalidatePath("/dashboard/expenses")
		return { success: true }
	} catch (error) {
		console.error("Error recording feedback:", error)
		return { success: false, error: "Failed to record feedback" }
	}
}

/**
 * Main AI assistant function that processes user messages through the agent pipeline
 */
export async function processAIAssistantMessage(
	userMessage: string,
	_chatHistory: Message[] = [],
	includeDebugInfo = false,
	customApiKey?: string
): Promise<ChatResponse> {
	try {
		// Get current user
		const { data: userData, error: userError } = await getCurrentUser()

		if (userError || !userData?.user) {
			return {
				content: "You need to be logged in to use the assistant.",
				error: "Authentication required",
			}
		}

		const _userId = userData.user.id

		// Use custom API key if provided, otherwise fall back to environment variable
		// const apiKey = customApiKey || env.OPENROUTER_API_KEY
		const apiKey = env.OPENROUTER_API_KEY

		if (!apiKey) {
			return {
				content: customApiKey
					? "The provided API key appears to be invalid. Please check your API key and try again."
					: "The assistant is not available at the moment. Please try again later or provide your own OpenRouter API key.",
				error: customApiKey ? "Invalid custom API key" : "OpenRouter API key is not configured",
			}
		}

		// Initialize AI agents service
		const aiAgents = new AIAgentsService(apiKey)

		// Step 1: Moderate the message
		const moderationResult = await aiAgents.moderateMessage(userMessage)

		if (!moderationResult.isRelevant) {
			return {
				content:
					"I'm your Budget Buddy assistant and can only help with questions about your finances and budgeting. Could you please ask something related to your expenses or financial planning?",
				moderationResult: includeDebugInfo ? moderationResult : undefined,
			}
		}

		const tools = await getTools()

		try {
			const result = await streamText({
				model: openrouter("anthropic/claude-3.5-sonnet"),
				messages: [
					{
						role: "user",
						content: userMessage,
					},
				],
				tools: tools,
			})

			// Wait for the full text to be generated
			const fullText = await result.text

			return {
				content: fullText,
			}
		} catch (error) {
			console.error("Error in AI assistant pipeline:", error)
			return {
				content: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
				error: error instanceof Error ? error.message : "Unknown error",
			}
		}

		// // Step 2: Generate SQL query
		// const generatedQuery = await aiAgents.generateQuery(userMessage)

		// // Step 3: Validate the query
		// const queryValidation = await aiAgents.checkQuery(generatedQuery)

		// if (!queryValidation.isValid) {
		// 	console.error("Query validation failed:", queryValidation.error)
		// 	return {
		// 		content:
		// 			"I'm having trouble understanding your question. Could you please rephrase it or provide more details about what you'd like to know about your finances?",
		// 		error: "Query validation failed",
		// 		debugInfo: includeDebugInfo
		// 			? {
		// 					query: generatedQuery,
		// 					queryValidation,
		// 				}
		// 			: undefined,
		// 	}
		// }

		// // Use the validated query (or corrected version if provided)
		// const finalQuery = queryValidation.correctedQuery || generatedQuery

		// // Replace placeholder with actual user ID
		// const queryWithUserId = finalQuery.replace(/\[USER_ID_PLACEHOLDER\]/g, userId)

		// // Step 4: Execute the query
		// const { data: queryResults, error: dbError } = await executeQuery(queryWithUserId, userId)

		// if (dbError) {
		// 	console.error("Database query error:", dbError)
		// 	return {
		// 		content:
		// 			"I encountered an issue while retrieving your financial data. Please try again with a more specific question.",
		// 		error: dbError,
		// 		debugInfo: includeDebugInfo
		// 			? {
		// 					query: queryWithUserId,
		// 					queryValidation,
		// 				}
		// 			: undefined,
		// 	}
		// }

		// // Step 5: Generate answer based on query results
		// const answer = await aiAgents.generateAnswer(userMessage, queryResults || [], chatHistory)

		// // Record the interaction for feedback (without waiting for it to complete)
		// try {
		// 	const supabase = await getServiceClient()
		// 	// Fire and forget - we don't await this
		// 	void supabase.from("feedback").insert({
		// 		question: userMessage,
		// 		answer: answer,
		// 		rating: 0, // Initial rating (0 = not rated yet)
		// 	})
		// } catch (error) {
		// 	// Just log the error, but don't fail the request
		// 	console.error("Error recording feedback:", error)
		// }

		// return {
		// 	content: answer,
		// 	debugInfo: includeDebugInfo
		// 		? {
		// 				query: queryWithUserId,
		// 				queryValidation,
		// 				resultsCount: Array.isArray(queryResults) ? queryResults.length : 0,
		// 			}
		// 		: undefined,
		// }
	} catch (error) {
		console.error("Error in AI assistant pipeline:", error)
		return {
			content: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
			error: error instanceof Error ? error.message : "Unknown error",
		}
	}
}
