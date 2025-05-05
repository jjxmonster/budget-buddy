import {
	Message,
	ModelOptions,
	OpenRouterConfig,
	OpenRouterError,
	OpenRouterResponse,
	ResponseFormat,
} from "@/types/openrouter.types"

const DEFAULT_CONFIG: OpenRouterConfig = {
	timeout: 30000,
	retries: 3,
	headers: {
		"HTTP-Referer": "https://budget-buddy.app",
		"X-Title": "Budget Buddy",
	},
}

export class OpenRouterService {
	private readonly apiUrl = "https://openrouter.ai/api/v1"

	constructor(
		private readonly apiKey: string,
		private defaultModel: string = "openai/gpt-4o-mini",
		private readonly config: OpenRouterConfig = DEFAULT_CONFIG
	) {
		this.validateApiKey()
	}

	/**
	 * Sends a message to the OpenRouter API and returns the response
	 */
	async sendMessage(
		messages: Message[],
		options?: {
			model?: string
			temperature?: number
			maxTokens?: number
			responseFormat?: ResponseFormat
		}
	): Promise<OpenRouterResponse> {
		const model = options?.model || this.defaultModel

		try {
			const response = await fetch(`${this.apiUrl}/chat/completions`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.apiKey}`,
					...this.config.headers,
				},
				body: JSON.stringify({
					model,
					messages,
					temperature: options?.temperature,
					max_tokens: options?.maxTokens,
					response_format: options?.responseFormat,
				}),
			})

			if (!response.ok) {
				throw new OpenRouterError(`OpenRouter API error: ${response.status}`, "API_ERROR", response.status)
			}

			const data = await response.json()
			return {
				content: data.choices[0].message.content,
				usage: {
					totalTokens: data.usage.total_tokens,
				},
			}
		} catch (error) {
			if (error instanceof OpenRouterError) {
				throw error
			}
			throw this.handleApiError(error)
		}
	}

	/**
	 * Higher-level method for chat-based interactions
	 */
	async sendChatCompletion(
		userMessage: string | Message,
		systemMessage?: string,
		chatHistory: Message[] = [],
		options?: ModelOptions
	): Promise<OpenRouterResponse> {
		const formattedUserMessage: Message =
			typeof userMessage === "string" ? { role: "user", content: userMessage } : userMessage

		const formattedSystemMessage: Message | null = systemMessage ? { role: "system", content: systemMessage } : null

		const messages: Message[] = [
			...(formattedSystemMessage ? [formattedSystemMessage] : []),
			...chatHistory,
			formattedUserMessage,
		]

		return this.sendMessage(messages, options)
	}

	/**
	 * Sets the default model to use for requests
	 */
	setDefaultModel(modelName: string): void {
		if (!modelName || typeof modelName !== "string") {
			throw new Error("Model name must be a non-empty string")
		}
		this.defaultModel = modelName
	}

	/**
	 * Validates the API key
	 */
	private validateApiKey(): void {
		if (!this.apiKey || typeof this.apiKey !== "string" || this.apiKey.trim() === "") {
			throw new Error("Invalid OpenRouter API key")
		}
	}

	/**
	 * Handles API errors and returns appropriate error types
	 */
	private handleApiError(error: unknown): OpenRouterError {
		const err = error as { response?: { status: number }; request?: unknown }

		if (err.response) {
			const status = err.response.status

			if (status === 401) {
				return new OpenRouterError("API key is invalid or expired", "INVALID_API_KEY", status, error as Error)
			}

			if (status === 429) {
				return new OpenRouterError("Rate limit exceeded", "RATE_LIMIT", status, error as Error)
			}

			return new OpenRouterError(`API error: ${status}`, "API_ERROR", status, error as Error)
		}

		if (err.request) {
			return new OpenRouterError("Network error - no response received", "NETWORK_ERROR", undefined, error as Error)
		}

		return new OpenRouterError("Error setting up request", "REQUEST_SETUP_ERROR", undefined, error as Error)
	}
}
