import { tool } from "ai"
import { z } from "zod"
import { getExpenses } from "@/services/supabase.service"

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

export default async function getTools() {
	return {
		getExpenses: getExpensesTool,
	}
}
