import { NextResponse } from "next/server"
import { z } from "zod"
import { DEFAULT_USER_ID } from "@/db/supabase.client"
import { createExpense, getExpenses } from "@/services/expense.service"
import { CreateExpenseCommand } from "@/types/types"
import {
	STATUS_BAD_REQUEST,
	STATUS_CREATED,
	STATUS_INTERNAL_SERVER_ERROR,
	STATUS_OK,
	STATUS_UNPROCESSABLE_ENTITY,
} from "@/utils/constants"

const createExpenseSchema = z.object({
	title: z.string().max(50, { message: "Title must be 50 characters or less" }),
	date: z.string(),
	amount: z.preprocess((val) => (typeof val === "string" ? Number(val) : val), z.number()),
	description: z.string().max(200, { message: "Description must be 200 characters or less" }).optional(),
	category_id: z.number().optional(),
	source_id: z.number().optional(),
})

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const expenseData = createExpenseSchema.parse(body)
		const createExpensePayload: CreateExpenseCommand & { user_id: string } = {
			...expenseData,
			user_id: DEFAULT_USER_ID,
		}
		const { data: insertedData, error } = await createExpense(createExpensePayload)
		if (error) {
			return NextResponse.json({ error: error.message }, { status: STATUS_UNPROCESSABLE_ENTITY })
		}
		return NextResponse.json(insertedData, { status: STATUS_CREATED })
	} catch (err) {
		if (err instanceof z.ZodError) {
			return NextResponse.json({ error: err.errors }, { status: STATUS_BAD_REQUEST })
		}
		return NextResponse.json({ error: "Internal Server Error" }, { status: STATUS_INTERNAL_SERVER_ERROR })
	}
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const page = searchParams.get("page")
	const limit = searchParams.get("limit")

	if (!page || !limit) {
		return NextResponse.json({ error: "Page and limit are required" }, { status: STATUS_BAD_REQUEST })
	}

	const { data: expenses, error } = await getExpenses(Number(page), Number(limit))

	if (error) {
		return NextResponse.json({ error: error.message }, { status: STATUS_UNPROCESSABLE_ENTITY })
	}
	return NextResponse.json(expenses, { status: STATUS_OK })
}