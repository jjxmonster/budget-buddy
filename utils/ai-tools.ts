import { tool } from "ai"
import { z } from "zod"
import { createCategory, getCategories } from "@/actions/category.actions"
import { createExpense } from "@/actions/expense.actions"
import { createSource, getSources } from "@/actions/source.actions"
import { getExpenses } from "@/services/supabase.service"
import type { CategoryDTO, CreateExpenseCommand } from "@/types/types"

const getExpensesSchema = z.object({
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	category: z.string().optional(),
	maxAmount: z.number().optional(),
	minAmount: z.number().optional(),
})

export type GetExpensesInput = z.infer<typeof getExpensesSchema>

export const getExpensesTool = tool({
	name: "getExpenses",
	description:
		"Get user's expenses based on the provided filters. Returns expense data including title, amount, date, category and source information.",
	inputSchema: getExpensesSchema,
	execute: async ({ dateFrom, dateTo, category, maxAmount, minAmount }) => {
		try {
			const expenses = await getExpenses({ dateFrom, dateTo, category, maxAmount, minAmount })

			const result = {
				success: true,
				data: expenses || [],
				summary: {
					totalExpenses: expenses?.length || 0,
					totalAmount: expenses?.reduce((sum, expense) => sum + (expense.amount || 0), 0) || 0,
					dateRange: { from: dateFrom, to: dateTo },
					filters: { category, maxAmount, minAmount },
				},
			}

			return result
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error occurred",
				data: [],
				summary: {
					totalExpenses: 0,
					totalAmount: 0,
					dateRange: { from: dateFrom, to: dateTo },
					filters: { category, maxAmount, minAmount },
				},
			}
		}
	},
})

const createCategorySchema = z.object({
	name: z.string().min(1, "Category name cannot be empty").max(100, "Category name is too long"),
})

const createSourceSchema = z.object({
	name: z.string().min(1, "Source name cannot be empty").max(100, "Source name is too long"),
})

const createExpenseSchema = z.object({
	title: z.string().min(1, "Title cannot be empty").max(50, "Title is too long"),
	description: z.string().max(200, "Description is too long").optional(),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date must be in YYYY-MM-DD format" }),
	amount: z.number().positive("Amount must be greater than 0"),
	category_id: z.number().int().positive().optional(),
	category_name: z.string().min(1).optional(),
	source_id: z.number().int().positive().optional(),
	source_name: z.string().min(1).optional(),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type CreateSourceInput = z.infer<typeof createSourceSchema>
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>

export const createCategoryTool = tool({
	name: "createCategory",
	description: "Create a new category for organizing expenses.",
	inputSchema: createCategorySchema,
	execute: async ({ name }) => {
		try {
			// First check if category already exists (case-insensitive)
			const categories = await getCategories()
			const existing = categories.find((c) => c.name.trim().toLowerCase() === name.trim().toLowerCase())

			if (existing) {
				return {
					success: true,
					data: existing,
					message: `Category '${existing.name}' already exists`,
				}
			}

			const category = await createCategory({ name })
			return {
				success: true,
				data: category,
				message: `Category '${category.name}' created successfully`,
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error occurred",
			}
		}
	},
})

export const createSourceTool = tool({
	name: "createSource",
	description: "Create a new source (e.g., Cash, Card) for expenses.",
	inputSchema: createSourceSchema,
	execute: async ({ name }) => {
		try {
			// First check if source already exists (case-insensitive)
			const sources = await getSources()
			const existing = sources.find((s) => s.name.trim().toLowerCase() === name.trim().toLowerCase())

			if (existing) {
				return {
					success: true,
					data: existing,
					message: `Source '${existing.name}' already exists`,
				}
			}

			const source = await createSource({ name })
			return {
				success: true,
				data: source,
				message: `Source '${source.name}' created successfully`,
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error occurred",
			}
		}
	},
})

export const createExpenseTool = tool({
	name: "createExpense",
	description:
		"Create a new expense. Required: title, date (YYYY-MM-DD), amount. Optional: description, category_id, source_id.",
	inputSchema: createExpenseSchema,
	execute: async (input) => {
		try {
			// Resolve category by name if id not provided
			let resolvedCategoryId = input.category_id
			if (!resolvedCategoryId && input.category_name) {
				const categories = await getCategories()
				const match = categories.find((c) => c.name.trim().toLowerCase() === input.category_name!.trim().toLowerCase())
				if (!match) {
					return {
						success: false,
						error: `Category '${input.category_name}' not found. Please provide an existing category or ask to create it first.`,
					}
				}
				resolvedCategoryId = Number(match.id)
			}

			// Auto-infer category from title/description if still not provided
			if (!resolvedCategoryId && !input.category_name) {
				const categories = await getCategories()
				const inferred = inferCategoryIdFromText(`${input.title} ${input.description ?? ""}`, categories)
				if (inferred) {
					resolvedCategoryId = inferred
				}
			}

			// Resolve source by name if id not provided
			let resolvedSourceId = input.source_id
			if (!resolvedSourceId && input.source_name) {
				const sources = await getSources()
				const match = sources.find((s) => s.name.trim().toLowerCase() === input.source_name!.trim().toLowerCase())
				if (!match) {
					return {
						success: false,
						error: `Source '${input.source_name}' not found. Please provide an existing source or ask to create it first.`,
					}
				}
				resolvedSourceId = Number(match.id)
			}

			const payload: CreateExpenseCommand = {
				title: input.title,
				description: input.description,
				date: input.date,
				amount: input.amount,
				category_id: resolvedCategoryId,
				source_id: resolvedSourceId,
			}

			const expense = await createExpense(payload)
			return {
				success: true,
				data: expense,
				message: `Expense '${expense.title}' for $${Number(expense.amount).toFixed(2)} created successfully`,
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error occurred",
			}
		}
	},
})

export const getCategoriesTool = tool({
	name: "getCategories",
	description: "List existing categories for the current user.",
	inputSchema: z.object({}).optional(),
	execute: async () => {
		try {
			const categories = await getCategories()
			return { success: true, data: categories }
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error occurred",
			}
		}
	},
})

export const getSourcesTool = tool({
	name: "getSources",
	description: "List existing sources for the current user.",
	inputSchema: z.object({}).optional(),
	execute: async () => {
		try {
			const sources = await getSources()
			return { success: true, data: sources }
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error occurred",
			}
		}
	},
})

export default async function getTools() {
	return {
		getExpenses: getExpensesTool,
		createExpense: createExpenseTool,
		createCategory: createCategoryTool,
		createSource: createSourceTool,
		getCategories: getCategoriesTool,
		getSources: getSourcesTool,
	}
}

// Helpers
function inferCategoryIdFromText(text: string, categories: CategoryDTO[]): number | undefined {
	const normalizedText = text.toLowerCase()

	const CATEGORY_SYNONYMS: Record<string, string[]> = {
		food: [
			"food",
			"restaurant",
			"meal",
			"lunch",
			"dinner",
			"breakfast",
			"burger",
			"pizza",
			"cafe",
			"coffee",
			"drink",
			"snack",
			"groceries",
			"grocery",
			"supermarket",
		],
		transport: ["transport", "uber", "taxi", "bus", "train", "fuel", "gas", "petrol", "parking", "ride", "ticket"],
		entertainment: ["movie", "cinema", "netflix", "spotify", "game", "concert", "event", "theater"],
		shopping: ["shopping", "clothes", "electronics", "amazon", "shop", "retail", "purchase"],
		health: ["pharmacy", "doctor", "medicine", "drug", "hospital", "gym", "fitness", "health"],
		utilities: ["electricity", "water", "internet", "phone", "utility", "bill"],
		housing: ["rent", "mortgage", "home", "apartment", "housing"],
		travel: ["travel", "trip", "holiday", "flight", "hotel", "airbnb"],
		subscriptions: ["subscription", "prime", "apple", "google", "microsoft"],
		education: ["education", "book", "course", "tuition", "school"],
	}

	let bestScore = 0
	let bestId: number | undefined = undefined

	for (const category of categories) {
		const name = String(category.name || "").toLowerCase()
		let score = 0

		if (name && normalizedText.includes(name)) {
			score += 2
		}

		for (const [label, synonyms] of Object.entries(CATEGORY_SYNONYMS)) {
			if (name.includes(label)) {
				for (const synonym of synonyms) {
					if (normalizedText.includes(synonym)) score += 1
				}
				break
			}
		}

		if (score > bestScore) {
			bestScore = score
			bestId = Number(category.id)
		}
	}

	if (bestScore > 0) return bestId
	return undefined
}
