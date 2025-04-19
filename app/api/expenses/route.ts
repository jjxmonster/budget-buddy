import { NextResponse } from "next/server"
import { z } from "zod"
import { DEFAULT_USER_ID } from "@/db/supabase.client"
import { createExpense, getExpenses } from "@/services/expense.service"
import { CreateExpenseCommand, ExpenseDTO } from "@/types/types"
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
		const createExpensePayload: CreateExpenseCommand = {
			...expenseData,
			user_id: DEFAULT_USER_ID,
		}

		try {
			const insertedData = await createExpense(createExpensePayload)
			return NextResponse.json(insertedData, { status: STATUS_CREATED })
		} catch (error) {
			if (error instanceof Error) {
				return NextResponse.json({ error: error.message }, { status: STATUS_UNPROCESSABLE_ENTITY })
			}
			return NextResponse.json({ error: "Failed to create expense" }, { status: STATUS_UNPROCESSABLE_ENTITY })
		}
	} catch (err) {
		if (err instanceof z.ZodError) {
			return NextResponse.json({ error: err.errors }, { status: STATUS_BAD_REQUEST })
		}
		return NextResponse.json({ error: "Internal Server Error" }, { status: STATUS_INTERNAL_SERVER_ERROR })
	}
}

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const page = searchParams.get("page")
		const limit = searchParams.get("limit")

		if (!page || !limit) {
			return NextResponse.json({ error: "Page and limit are required" }, { status: STATUS_BAD_REQUEST })
		}

		const expenses = await getExpenses()
		return NextResponse.json(expenses, { status: STATUS_OK })
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: STATUS_UNPROCESSABLE_ENTITY })
		}
		return NextResponse.json({ error: "Internal Server Error" }, { status: STATUS_INTERNAL_SERVER_ERROR })
	}
}
