import { tool } from "ai"
import { z } from "zod"

const getExpensesSchema = z.object({
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	category: z.string().optional(),
	maxAmount: z.number().optional(),
	minAmount: z.number().optional(),
})

export type GetExpensesInput = z.infer<typeof getExpensesSchema>

export const getExpenses = tool({
	name: "getExpenses",
	description: "Get expenses",
	inputSchema: getExpensesSchema,
})

export default async function getTools() {
	return [getExpenses]
}
