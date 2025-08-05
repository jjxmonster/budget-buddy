import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { convertToModelMessages, streamText } from "ai"
import { env } from "@/env.mjs"
import { AI_ASSISTANT_SYSTEM_PROMPT } from "@/utils/ai-prompts"
import getTools from "@/utils/ai-tools"
import { CLAUDE_3_5_SONNET } from "@/utils/constants"

export const maxDuration = 30

const openrouter = createOpenRouter({
	apiKey: env.OPENROUTER_API_KEY,
})

export async function POST(req: Request) {
	const { messages } = await req.json()

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
}
