// OpenRouter API types

export interface Message {
	role: "system" | "user" | "assistant"
	content: string
}

export interface OpenRouterConfig {
	timeout: number
	retries: number
	headers?: Record<string, string>
}

export interface ModelOptions {
	model?: string
	temperature?: number
	maxTokens?: number
	topP?: number
	responseFormat?: ResponseFormat
}

export interface ResponseFormat {
	type: "json_schema" | "text" | "json_object"
	json_schema?: {
		name: string
		strict: boolean
		schema: object
	}
}

export interface OpenRouterResponse {
	content: string
	usage: {
		totalTokens: number
	}
}

export class OpenRouterError extends Error {
	constructor(
		message: string,
		public code: string,
		public status?: number,
		public originalError?: Error
	) {
		super(message)
		this.name = "OpenRouterError"
	}
}

export interface OpenRouterModelInfo {
	id: string
	name: string
	description: string
	context_length: number
	pricing: {
		prompt: number
		completion: number
	}
}
