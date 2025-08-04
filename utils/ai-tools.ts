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
	description: "Get expenses",
	inputSchema: getExpensesSchema,
	execute: async ({ dateFrom, dateTo, category, maxAmount, minAmount }) => {
		const expenses = await getExpenses({ dateFrom, dateTo, category, maxAmount, minAmount })
		console.log("expenses", expenses)
		return expenses
	},
})

export default async function getTools() {
	return {
		getExpenses: getExpensesTool,
	}
}
