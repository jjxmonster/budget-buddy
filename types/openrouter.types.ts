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
	temperature?: number
	maxTokens?: number
	topP?: number
	responseFormat?: ResponseFormat
}

export interface ResponseFormat {
	type: "json_schema"
	json_schema: {
		name: string
		strict: boolean
		schema: object
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

export interface OpenRouterResponse {
	content: string
	usage: {
		totalTokens: number
	}
}

export interface OpenRouterModelInfo {
	id: string
	name: string
	context_length: number
	pricing: {
		prompt: number
		completion: number
	}
}
