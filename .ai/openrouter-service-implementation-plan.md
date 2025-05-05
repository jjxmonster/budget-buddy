# OpenRouter Service Implementation Plan

## 1. Service Description

The OpenRouter service will act as a middleware layer between our application and the OpenRouter API, enabling AI-powered chat functionality using various LLM providers. This service will handle authentication, request formatting, response parsing, and error handling for all interactions with OpenRouter.

## 2. Constructor

The OpenRouter service constructor will initialize with:

- API key for authentication
- Default model settings
- Configuration options
- Logging utilities

```typescript
class OpenRouterService {
	constructor(
		private readonly apiKey: string,
		private readonly defaultModel: string = "openai/gpt-3.5-turbo",
		private readonly config: OpenRouterConfig = DEFAULT_CONFIG,
		private readonly logger?: Logger
	) {
		this.validateApiKey()
	}
}
```

## 3. Public Methods and Fields

### Methods

1. **sendMessage**

   - Purpose: Send a message to an LLM and get a response
   - Parameters:
     - `messages`: Array of message objects (system, user, assistant)
     - `options`: Optional parameters (model, temperature, etc.)
   - Returns: LLM response

2. **sendChatCompletion**

   - Purpose: Higher-level method for chat-based interactions
   - Parameters:
     - `userMessage`: String or object containing user's message
     - `systemMessage`: Optional string for system instructions
     - `chatHistory`: Optional array of previous messages
     - `options`: Optional parameters

3. **getAvailableModels**

   - Purpose: Retrieve list of available models from OpenRouter
   - Returns: Array of model objects with metadata

4. **setDefaultModel**
   - Purpose: Update the default model
   - Parameters:
     - `modelName`: String identifier for the model

### Fields

1. **DEFAULT_SYSTEM_MESSAGE**: String template for standard system instructions
2. **MODELS**: Enum or object mapping user-friendly names to API model identifiers
3. **supportedFeatures**: Object detailing which models support which features

## 4. Private Methods and Fields

### Methods

1. **validateApiKey**

   - Purpose: Ensure API key is valid format
   - Throws: Error if key format is invalid

2. **buildRequestPayload**

   - Purpose: Construct payload for OpenRouter API
   - Parameters:
     - `messages`: Message array
     - `options`: Request options
   - Returns: Formatted request object

3. **parseResponse**

   - Purpose: Process and normalize API response
   - Parameters:
     - `rawResponse`: Response from OpenRouter API
   - Returns: Cleaned response object

4. **handleStructuredOutput**
   - Purpose: Process responses with JSON schema formatting
   - Parameters:
     - `response`: Raw response
     - `schema`: Expected JSON schema
   - Returns: Validated structured data

### Fields

1. **API_ENDPOINTS**: Object mapping operation names to API URLs
2. **DEFAULT_CONFIG**: Default configuration settings
3. **ERROR_MESSAGES**: Standardized error message templates

## 5. Error Handling

1. **API Connection Errors**

   - Implement exponential backoff retry logic for transient network issues
   - Cache previous successful responses for fallback during outages
   - Provide clear error messages distinguishing between connection vs. authentication failures

2. **Rate Limiting**

   - Track request quotas and implement preemptive throttling
   - Queue non-urgent requests during high traffic periods
   - Provide hooks for UI to show "cooling down" status

3. **Invalid Responses**

   - Validate responses against expected schemas
   - Implement fallback/graceful degradation when responses are malformed
   - Log problematic responses for debugging

4. **Custom Error Classes**
   ```typescript
   class OpenRouterError extends Error {
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
   ```

## 6. Security Considerations

1. **API Key Management**

   - Never expose API key in client-side code
   - Implement server-side proxy for all OpenRouter requests
   - Use environment variables for key storage

2. **Content Filtering**

   - Implement input validation to prevent prompt injection
   - Consider adding content moderation for user inputs
   - Provide configuration for controlling content sensitivity levels

3. **Cost Controls**

   - Implement token counting to estimate request costs
   - Add configurable limits to prevent unexpected charges
   - Create monitoring system for usage patterns

4. **Data Handling**
   - Consider PII concerns in message content
   - Implement options for local message history vs. API history
   - Add consent management for data processing

## 7. Step-by-Step Implementation Plan

### Phase 1: Core Setup

1. Create the base service structure in `services/openrouter.ts`:

   ```typescript
   import { OpenRouterConfig, Message, ModelOptions } from "../types"

   export class OpenRouterService {
   	private readonly apiUrl = "https://openrouter.ai/api/v1"

   	constructor(
   		private readonly apiKey: string,
   		private readonly defaultModel: string = "openai/gpt-3.5-turbo",
   		private readonly config: OpenRouterConfig = DEFAULT_CONFIG
   	) {}

   	// Methods will be implemented in later phases
   }
   ```

2. Define types in `types.ts`:

   ```typescript
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
   ```

### Phase 2: Basic Functionality

1. Implement the core `sendMessage` method:

   ```typescript
   async sendMessage(
     messages: Message[],
     options?: {
       model?: string;
       temperature?: number;
       maxTokens?: number;
       responseFormat?: ResponseFormat;
     }
   ): Promise<{ content: string; usage: { totalTokens: number } }> {
     const model = options?.model || this.defaultModel;

     const response = await fetch(`${this.apiUrl}/chat/completions`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${this.apiKey}`,
         ...this.config.headers
       },
       body: JSON.stringify({
         model,
         messages,
         temperature: options?.temperature,
         max_tokens: options?.maxTokens,
         response_format: options?.responseFormat
       })
     });

     if (!response.ok) {
       throw new Error(`OpenRouter API error: ${response.status}`);
     }

     const data = await response.json();
     return {
       content: data.choices[0].message.content,
       usage: {
         totalTokens: data.usage.total_tokens
       }
     };
   }
   ```

2. Create server action in `services/openrouter-actions.ts`:

   ```typescript
   "use server"

   import { OpenRouterService } from "./openrouter"

   export async function generateChatResponse(userMessage: string, chatHistory: { role: string; content: string }[]) {
   	const openRouter = new OpenRouterService(process.env.OPENROUTER_API_KEY!)

   	try {
   		const systemMessage = {
   			role: "system" as const,
   			content: "You are a helpful assistant.",
   		}

   		const messages = [systemMessage, ...chatHistory, { role: "user" as const, content: userMessage }]

   		return await openRouter.sendMessage(messages)
   	} catch (error) {
   		console.error("Error generating chat response:", error)
   		throw new Error("Failed to generate response")
   	}
   }
   ```

### Phase 3: Advanced Features

1. Add structured output support:

   ```typescript
   async generateStructuredOutput<T>(
     userMessage: string,
     schema: object,
     schemaName: string,
     systemMessage?: string
   ): Promise<T> {
     const messages = [
       {
         role: 'system' as const,
         content: systemMessage || 'You are a helpful assistant that outputs valid JSON.'
       },
       { role: 'user' as const, content: userMessage }
     ];

     const responseFormat = {
       type: 'json_schema' as const,
       json_schema: {
         name: schemaName,
         strict: true,
         schema
       }
     };

     const response = await this.sendMessage(messages, { responseFormat });
     return JSON.parse(response.content) as T;
   }
   ```

2. Implement model switching:

   ```typescript
   async switchToLowerCostModel(): Promise<string> {
     // Logic to choose cheaper model based on requirements
     const models = await this.getAvailableModels();
     const sortedByPrice = models.sort((a, b) => a.pricing.prompt - b.pricing.prompt);
     const viable = sortedByPrice.filter(m => m.context_length >= 8192);

     if (viable.length) {
       this.setDefaultModel(viable[0].id);
       return viable[0].id;
     }

     return this.defaultModel;
   }
   ```

### Phase 4: Error Handling and Robustness

1. Implement retry logic:

   ```typescript
   private async executeWithRetry<T>(
     fn: () => Promise<T>,
     retries = this.config.retries
   ): Promise<T> {
     try {
       return await fn();
     } catch (error) {
       if (retries <= 0) throw error;

       const isRetryable = this.isRetryableError(error);
       if (!isRetryable) throw error;

       const delay = Math.pow(2, this.config.retries - retries) * 1000;
       await new Promise(resolve => setTimeout(resolve, delay));

       return this.executeWithRetry(fn, retries - 1);
     }
   }

   private isRetryableError(error: any): boolean {
     if (!error.status) return false;
     return [408, 429, 500, 502, 503, 504].includes(error.status);
   }
   ```

2. Add comprehensive error handling:

   ```typescript
   private handleApiError(error: any): never {
     if (error.response) {
       const status = error.response.status;

       if (status === 401) {
         throw new OpenRouterError(
           'API key is invalid or expired',
           'INVALID_API_KEY',
           status,
           error
         );
       }

       if (status === 429) {
         throw new OpenRouterError(
           'Rate limit exceeded',
           'RATE_LIMIT',
           status,
           error
         );
       }

       throw new OpenRouterError(
         `API error: ${status}`,
         'API_ERROR',
         status,
         error
       );
     }

     if (error.request) {
       throw new OpenRouterError(
         'Network error - no response received',
         'NETWORK_ERROR',
         undefined,
         error
       );
     }

     throw new OpenRouterError(
       'Error setting up request',
       'REQUEST_SETUP_ERROR',
       undefined,
       error
     );
   }
   ```

### Phase 5: UI Integration

1. Create a chat component in `app/(main)/_components/ChatInterface.tsx`:

   ```tsx
   "use client"

   import { useState } from "react"
   import { useChat } from "@/lib/useChat"

   export function ChatInterface() {
   	const [input, setInput] = useState("")
   	const { messages, isLoading, sendMessage } = useChat()

   	const handleSubmit = (e: React.FormEvent) => {
   		e.preventDefault()
   		if (!input.trim()) return

   		sendMessage(input)
   		setInput("")
   	}

   	return (
   		<div className="flex h-full flex-col">
   			<div className="flex-1 space-y-4 overflow-y-auto p-4">
   				{messages.map((message, i) => (
   					<div
   						key={i}
   						className={`${message.role === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"} max-w-[80%] rounded-lg p-3`}
   					>
   						{message.content}
   					</div>
   				))}
   				{isLoading && <div className="bg-muted rounded-lg p-3">Thinking...</div>}
   			</div>

   			<form onSubmit={handleSubmit} className="border-t p-4">
   				<div className="flex gap-2">
   					<input
   						type="text"
   						value={input}
   						onChange={(e) => setInput(e.target.value)}
   						placeholder="Type your message..."
   						className="flex-1 rounded-md border p-2"
   					/>
   					<button
   						type="submit"
   						disabled={isLoading}
   						className="bg-primary text-primary-foreground rounded-md px-4 py-2 disabled:opacity-50"
   					>
   						Send
   					</button>
   				</div>
   			</form>
   		</div>
   	)
   }
   ```

2. Create a custom hook in `lib/useChat.ts`:

   ```typescript
   import { useState } from "react"
   import { generateChatResponse } from "@/services/openrouter-actions"
   import { Message } from "@/types"

   export function useChat() {
   	const [messages, setMessages] = useState<Message[]>([])
   	const [isLoading, setIsLoading] = useState(false)
   	const [error, setError] = useState<string | null>(null)

   	async function sendMessage(content: string) {
   		setIsLoading(true)
   		setError(null)

   		const userMessage: Message = { role: "user", content }
   		setMessages((prev) => [...prev, userMessage])

   		try {
   			const chatHistory = messages.map(({ role, content }) => ({ role, content }))
   			const response = await generateChatResponse(content, chatHistory)

   			const assistantMessage: Message = {
   				role: "assistant",
   				content: response.content,
   			}

   			setMessages((prev) => [...prev, assistantMessage])
   		} catch (err) {
   			setError(err instanceof Error ? err.message : "Something went wrong")
   		} finally {
   			setIsLoading(false)
   		}
   	}

   	return {
   		messages,
   		isLoading,
   		error,
   		sendMessage,
   	}
   }
   ```

### Phase 6: Security and Environment Setup

1. Update `.env.local` with required variables:

   ```
   OPENROUTER_API_KEY=your_api_key_here
   OPENROUTER_DEFAULT_MODEL=openai/gpt-3.5-turbo
   ```

2. Create middleware to protect sensitive routes in `middleware.ts`:

   ```typescript
   import { NextRequest, NextResponse } from "next/server"

   export function middleware(request: NextRequest) {
   	// Add authentication checks if needed
   	// For example, require sign-in for chat routes

   	return NextResponse.next()
   }

   export const config = {
   	matcher: ["/api/chat/:path*"],
   }
   ```

### Phase 7: Testing and Monitoring

1. Create unit tests for the OpenRouter service
2. Set up monitoring for API usage and costs
3. Implement user feedback collection mechanism for response quality
4. Create dashboard for usage statistics
