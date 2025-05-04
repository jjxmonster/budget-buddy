import { test as teardown } from "@playwright/test"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/db/database.types"

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
	throw new Error("Missing Supabase environment variables for teardown")
}

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY)

teardown("clean database", async () => {
	console.log("Cleaning up test database...")

	try {
		// Get the user ID from environment variables, or extract from auth file
		const userId = process.env.E2E_USER_ID

		if (!userId) {
			console.warn("No user ID found for cleanup, skipping teardown")
			return
		}

		// Delete data for the test user in the correct order to avoid foreign key constraints
		console.log(`Deleting data for user ${userId}`)

		// Delete expenses first (they reference categories and sources)
		const { error: expenseError } = await supabase.from("expense").delete().eq("user_id", userId)

		if (expenseError) {
			console.error("Error deleting expenses:", expenseError)
		} else {
			console.log("Successfully deleted expenses")
		}

		// Delete categories
		const { error: categoryError } = await supabase.from("category").delete().eq("user_id", userId)

		if (categoryError) {
			console.error("Error deleting categories:", categoryError)
		} else {
			console.log("Successfully deleted categories")
		}

		// Delete sources
		const { error: sourceError } = await supabase.from("source").delete().eq("user_id", userId)

		if (sourceError) {
			console.error("Error deleting sources:", sourceError)
		} else {
			console.log("Successfully deleted sources")
		}

		console.log("Database cleanup completed")
	} catch (error) {
		console.error("Error during database cleanup:", error)
	}
})
