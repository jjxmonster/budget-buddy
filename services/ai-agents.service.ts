import { Database } from "@/db/database.types"
import { Message } from "@/types/openrouter.types"
import { OpenRouterService } from "./openrouter.service"

// Agent roles and model selection for optimal cost/performance
type AgentRole = "moderator" | "queryGenerator" | "queryChecker" | "answerGenerator"

const AGENT_MODELS: Record<AgentRole, string> = {
	moderator: "openai/gpt-3.5-turbo", // Efficient for simple content moderation
	queryGenerator: "openai/gpt-4o-mini", // Balance between performance and cost for SQL generation
	queryChecker: "openai/gpt-3.5-turbo", // Efficient for validation tasks
	answerGenerator: "openai/gpt-4o-mini", // High quality for final responses
}

// Type for database query results
type ExpenseRecord = Database["public"]["Tables"]["expense"]["Row"]
type CategoryRecord = Database["public"]["Tables"]["category"]["Row"]
type SourceRecord = Database["public"]["Tables"]["source"]["Row"]
type DatabaseResult = ExpenseRecord | CategoryRecord | SourceRecord | Record<string, unknown>

export class AIAgentsService {
	private openRouter: OpenRouterService

	constructor(apiKey: string) {
		this.openRouter = new OpenRouterService(apiKey)
	}

	/**
	 * 1. AI Moderator - checks if user message is relevant to finances and budget
	 */
	async moderateMessage(userMessage: string): Promise<{ isRelevant: boolean; reason: string }> {
		const systemMessage = `
      You are an AI moderator for a budget tracking application.
      Your task is to determine if the user's message is related to personal finances, budgeting, or the user's expense history.
      Respond with a JSON object containing:
      - "isRelevant": true if the message is related to finances or the budget app, false otherwise
      - "reason": brief explanation of your decision
    `

		this.openRouter.setDefaultModel(AGENT_MODELS.moderator)

		const response = await this.openRouter.sendChatCompletion(userMessage, systemMessage)
		try {
			return JSON.parse(response.content) as { isRelevant: boolean; reason: string }
		} catch (error) {
			console.error("Failed to parse moderator response:", error)
			return { isRelevant: false, reason: "Failed to process content moderation." }
		}
	}

	/**
	 * 2. Query Generator - creates SQL query based on user question
	 */
	async generateQuery(userMessage: string): Promise<string> {
		const systemMessage = `
      You are an SQL query generator for a budget tracking application with PostgreSQL database.
      Your task is to generate a precise SQL query based on the user's question about their expenses.
      
      Database schema:
      - expense: id, title, description, amount, date, category_id, source_id, user_id
      - category: id, name, user_id
      - source: id, name, user_id
      
      Important rules:
      - ALWAYS include "user_id = '[USER_ID_PLACEHOLDER]'" in the WHERE clause to ensure security
      - ONLY use tables: expense, category, and source
      - Use appropriate JOINs when referencing categories or sources
      - Keep queries efficient and focused on the specific information requested
      - Return only the SQL query as plain text, without any explanation or markdown formatting
      - Use standard PostgreSQL syntax
    `

		this.openRouter.setDefaultModel(AGENT_MODELS.queryGenerator)

		const response = await this.openRouter.sendChatCompletion(userMessage, systemMessage)
		return response.content.trim()
	}

	/**
	 * 3. Query Checker - validates generated SQL query
	 */
	async checkQuery(query: string): Promise<{ isValid: boolean; correctedQuery?: string; error?: string }> {
		const systemMessage = `
      You are an SQL validator for a budget tracking application with PostgreSQL database.
      Your task is to check if the provided SQL query is valid, secure, and follows best practices.
      
      Database schema:
      - expense: id, title, description, amount, date, category_id, source_id, user_id
      - category: id, name, user_id
      - source: id, name, user_id
      
      Validation criteria:
      - Query should ONLY use tables: expense, category, and source
      - MUST include "user_id = '[USER_ID_PLACEHOLDER]'" in the WHERE clause
      - No SQL injection vulnerabilities or security issues
      - Proper PostgreSQL syntax
      - Reasonable performance (no unnecessary JOINs or operations)
      
      Respond with a JSON object containing:
      - "isValid": boolean indicating if the query is valid
      - "correctedQuery": string with the fixed query (if there were issues)
      - "error": string describing the issue (if there were issues)
    `

		this.openRouter.setDefaultModel(AGENT_MODELS.queryChecker)

		const response = await this.openRouter.sendChatCompletion(query, systemMessage)
		try {
			return JSON.parse(response.content) as { isValid: boolean; correctedQuery?: string; error?: string }
		} catch (error) {
			console.error("Failed to parse query checker response:", error)
			return {
				isValid: false,
				error: "Failed to validate the query due to an internal error.",
			}
		}
	}

	/**
	 * 4. Answer Generator - produces a helpful response based on database results and user question
	 */
	async generateAnswer(
		userMessage: string,
		databaseResults: DatabaseResult[],
		chatHistory: Message[] = []
	): Promise<string> {
		this.openRouter.setDefaultModel(AGENT_MODELS.answerGenerator)

		// Create context with database results
		const contextMessage: Message = {
			role: "system",
			content: `Database query results: ${JSON.stringify(databaseResults)} | Today is ${new Date().toLocaleDateString()}`,
		}

		// Combine the messages with proper typing
		const allMessages: Message[] = [...chatHistory, contextMessage, { role: "user", content: userMessage }]

		const response = await this.openRouter.sendMessage(allMessages, {
			model: AGENT_MODELS.answerGenerator,
			temperature: 0.7,
		})

		return response.content
	}
}
