import { tool } from "ai"
import { z } from "zod"
import { createCategory } from "@/actions/category.actions"
import { createExpense } from "@/actions/expense.actions"
import { createSource } from "@/actions/source.actions"
import { getExpenses } from "@/services/supabase.service"
import type { CreateExpenseCommand } from "@/types/types"

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
	source_id: z.number().int().positive().optional(),
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
			const payload: CreateExpenseCommand = {
				title: input.title,
				description: input.description,
				date: input.date,
				amount: input.amount,
				category_id: input.category_id,
				source_id: input.source_id,
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

export default async function getTools() {
	return {
		getExpenses: getExpensesTool,
		createExpense: createExpenseTool,
		createCategory: createCategoryTool,
		createSource: createSourceTool,
	}
}
