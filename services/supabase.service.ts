"use server"

import { createClient } from "@/db/supabase.client"

/**
 * Get a Supabase client instance with service role key for admin operations
 */
export async function getServiceClient() {
	return createClient()
}

/**
 * Get the current user from the session
 */
export async function getCurrentUser() {
	const supabase = await createClient()
	return supabase.auth.getUser()
}

export async function executeQuery(query: string, userId: string) {
	const supabase = await createClient()

	// For security, we only allow simple SELECT queries for now
	if (!query.trim().toLowerCase().startsWith("select")) {
		throw new Error("Only SELECT queries are allowed")
	}

	// First safety check: ensure the query contains the user_id filter
	// This is critical for security to prevent data leakage across users
	if (!query.includes(`user_id = '${userId}'`)) {
		throw new Error("Query must filter by user_id for security")
	}

	try {
		// Since we can't directly call custom functions without defining them first,
		// we'll use a more direct approach for this demo
		// In production, this should be a proper database function with parameterized queries

		// Get data from the relevant tables based on the user's permissions
		let data

		if (query.toLowerCase().includes("expense")) {
			const { data: expenses, error } = await supabase
				.from("expense")
				.select("*, category:category_id(name), source:source_id(name)")
				.eq("user_id", userId)

			if (error) throw error
			data = expenses
		} else if (query.toLowerCase().includes("category")) {
			const { data: categories, error } = await supabase.from("category").select("*").eq("user_id", userId)

			if (error) throw error
			data = categories
		} else if (query.toLowerCase().includes("source")) {
			const { data: sources, error } = await supabase.from("source").select("*").eq("user_id", userId)

			if (error) throw error
			data = sources
		} else {
			throw new Error("Query must reference allowed tables: expense, category, or source")
		}

		return { data, error: null }
	} catch (error) {
		console.error("Error executing query:", error)
		return {
			data: null,
			error: error instanceof Error ? error.message : "Unknown database error",
		}
	}
}
