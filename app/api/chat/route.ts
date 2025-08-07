import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { convertToModelMessages, streamText } from "ai"
import { env } from "@/env.mjs"
import { AI_ASSISTANT_SYSTEM_PROMPT } from "@/utils/ai-prompts"
import getTools from "@/utils/ai-tools"
import { CLAUDE_3_5_SONNET } from "@/utils/constants"

export const maxDuration = 30

export async function POST(req: Request) {
	try {
		// Parse and validate request body
		let body
		try {
			body = await req.json()
		} catch (error) {
			return new Response(
				JSON.stringify({
					error: "Invalid JSON in request body",
					details: error instanceof Error ? error.message : "Unknown JSON parsing error",
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			)
		}

		// Validate required fields
		const { messages, apiKey } = body

		if (!messages) {
			return new Response(
				JSON.stringify({
					error: "Missing required field: messages",
					details: "The request body must include a 'messages' property",
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			)
		}

		if (!Array.isArray(messages)) {
			return new Response(
				JSON.stringify({
					error: "Invalid messages format",
					details: "The 'messages' property must be an array",
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			)
		}

		// Use custom API key if provided, otherwise fall back to environment variable
		const effectiveApiKey = apiKey || env.OPENROUTER_API_KEY

		if (!effectiveApiKey) {
			return new Response(
				JSON.stringify({
					error: "No API key available",
					details: "Either provide an apiKey in the request body or set OPENROUTER_API_KEY environment variable",
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			)
		}

		// Create OpenRouter client with the effective API key
		const openrouter = createOpenRouter({
			apiKey: effectiveApiKey,
		})

		const result = streamText({
			model: openrouter(CLAUDE_3_5_SONNET),
			messages: [
				{
					role: "system",
					content: AI_ASSISTANT_SYSTEM_PROMPT,
				},
				...convertToModelMessages(messages),
			],
			tools: await getTools(),
		})

		return result.toUIMessageStreamResponse()
	} catch (error) {
		console.error("Error in chat route:", error)

		return new Response(
			JSON.stringify({
				error: "Internal server error",
				details: error instanceof Error ? error.message : "Unknown error occurred",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		)
	}
}
