import { createClient } from "@supabase/supabase-js"
import { env } from "@/env.mjs"
import { TablesInsert } from "./database.types"

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY)

const SAMPLE_USER_ID = "9b675eb1-8562-40c6-890c-ff05673b9cc8"

export async function seedDatabase() {
	console.log("🌱 Starting database seeding...")

	try {
		console.log("🧹 Clearing existing data...")
		await supabase.from("expense").delete().gte("id", 0)
		await supabase.from("category").delete().gte("id", 0)
		await supabase.from("source").delete().gte("id", 0)
		await supabase.from("feedback").delete().gte("id", 0)

		console.log("📂 Seeding categories...")
		const categoriesData: TablesInsert<"category">[] = [
			{ name: "Food & Dining", user_id: SAMPLE_USER_ID },
			{ name: "Transportation", user_id: SAMPLE_USER_ID },
			{ name: "Shopping", user_id: SAMPLE_USER_ID },
			{ name: "Entertainment", user_id: SAMPLE_USER_ID },
			{ name: "Bills & Utilities", user_id: SAMPLE_USER_ID },
			{ name: "Healthcare", user_id: SAMPLE_USER_ID },
			{ name: "Travel", user_id: SAMPLE_USER_ID },
			{ name: "Education", user_id: SAMPLE_USER_ID },
			{ name: "Personal Care", user_id: SAMPLE_USER_ID },
			{ name: "Miscellaneous", user_id: SAMPLE_USER_ID },
		]

		const { data: categories, error: categoriesError } = await supabase.from("category").insert(categoriesData).select()

		if (categoriesError) throw categoriesError
		console.log(`✅ Created ${categories.length} categories`)

		console.log("💳 Seeding sources...")
		const sourcesData: TablesInsert<"source">[] = [
			{ name: "Chase Credit Card", user_id: SAMPLE_USER_ID },
			{ name: "Bank of America Checking", user_id: SAMPLE_USER_ID },
			{ name: "Wells Fargo Savings", user_id: SAMPLE_USER_ID },
			{ name: "Cash", user_id: SAMPLE_USER_ID },
			{ name: "PayPal", user_id: SAMPLE_USER_ID },
			{ name: "Venmo", user_id: SAMPLE_USER_ID },
			{ name: "Apple Pay", user_id: SAMPLE_USER_ID },
		]

		const { data: sources, error: sourcesError } = await supabase.from("source").insert(sourcesData).select()

		if (sourcesError) throw sourcesError
		console.log(`✅ Created ${sources.length} sources`)

		console.log("💰 Seeding expenses...")
		const expensesData: TablesInsert<"expense">[] = [
			{
				title: "Grocery Shopping",
				amount: 89.45,
				description: "Weekly groceries at Whole Foods",
				date: "2025-07-15",
				category_id: categories.find((c) => c.name === "Food & Dining")?.id || null,
				source_id: sources.find((s) => s.name === "Chase Credit Card")?.id || null,
				user_id: SAMPLE_USER_ID,
			},
			{
				title: "Gas Station",
				amount: 45.2,
				description: "Fill up at Shell station",
				date: "2025-07-15",
				category_id: categories.find((c) => c.name === "Transportation")?.id || null,
				source_id: sources.find((s) => s.name === "Chase Credit Card")?.id || null,
				user_id: SAMPLE_USER_ID,
			},
			{
				title: "Netflix Subscription",
				amount: 15.99,
				description: "Monthly streaming subscription",
				date: "2025-07-15",
				category_id: categories.find((c) => c.name === "Entertainment")?.id || null,
				source_id: sources.find((s) => s.name === "Bank of America Checking")?.id || null,
				user_id: SAMPLE_USER_ID,
			},
			{
				title: "Coffee Shop",
				amount: 5.75,
				description: "Morning latte at Starbucks",
				date: "2025-07-15",
				category_id: categories.find((c) => c.name === "Food & Dining")?.id || null,
				source_id: sources.find((s) => s.name === "Apple Pay")?.id || null,
				user_id: SAMPLE_USER_ID,
			},
			{
				title: "Electric Bill",
				amount: 125.3,
				description: "Monthly electricity bill",
				date: "2025-07-15",
				category_id: categories.find((c) => c.name === "Bills & Utilities")?.id || null,
				source_id: sources.find((s) => s.name === "Bank of America Checking")?.id || null,
				user_id: SAMPLE_USER_ID,
			},
			{
				title: "Amazon Purchase",
				amount: 67.89,
				description: "Office supplies and cables",
				date: "2025-07-15",
				category_id: categories.find((c) => c.name === "Shopping")?.id || null,
				source_id: sources.find((s) => s.name === "Chase Credit Card")?.id || null,
				user_id: SAMPLE_USER_ID,
			},
			{
				title: "Uber Ride",
				amount: 18.45,
				description: "Ride to airport",
				date: "2024-01-09",
				category_id: categories.find((c) => c.name === "Transportation")?.id || null,
				source_id: sources.find((s) => s.name === "PayPal")?.id || null,
				user_id: SAMPLE_USER_ID,
			},
			{
				title: "Movie Tickets",
				amount: 24.0,
				description: "Two tickets for evening show",
				date: "2024-01-08",
				category_id: categories.find((c) => c.name === "Entertainment")?.id || null,
				source_id: sources.find((s) => s.name === "Cash")?.id || null,
				user_id: SAMPLE_USER_ID,
			},
			{
				title: "Pharmacy",
				amount: 32.15,
				description: "Prescription medication",
				date: "2024-01-07",
				category_id: categories.find((c) => c.name === "Healthcare")?.id || null,
				source_id: sources.find((s) => s.name === "Chase Credit Card")?.id || null,
				user_id: SAMPLE_USER_ID,
			},
			{
				title: "Restaurant Dinner",
				amount: 85.6,
				description: "Dinner at Italian restaurant",
				date: "2024-01-06",
				category_id: categories.find((c) => c.name === "Food & Dining")?.id || null,
				source_id: sources.find((s) => s.name === "Chase Credit Card")?.id || null,
				user_id: SAMPLE_USER_ID,
			},
		]

		const { data: expenses, error: expensesError } = await supabase.from("expense").insert(expensesData).select()

		if (expensesError) throw expensesError
		console.log(`✅ Created ${expenses.length} expenses`)

		// Seed Feedback
		console.log("💬 Seeding feedback...")
		const feedbackData: TablesInsert<"feedback">[] = [
			{
				question: "How was your experience with the expense tracking feature?",
				answer: "It was very intuitive and easy to use. I love the categorization feature.",
				rating: 5,
			},
			{
				question: "What do you think about the dashboard layout?",
				answer: "The dashboard is clean and well-organized. Could use more chart options.",
				rating: 4,
			},
			{
				question: "How helpful is the AI assistant for managing expenses?",
				answer: "Very helpful! It provides great insights and suggestions for budgeting.",
				rating: 5,
			},
			{
				question: "Rate the mobile responsiveness of the application",
				answer: "Works well on mobile devices, though some buttons could be larger.",
				rating: 4,
			},
			{
				question: "How satisfied are you with the expense categorization?",
				answer: "Good selection of categories, but would like custom category creation.",
				rating: 4,
			},
		]

		const { data: feedback, error: feedbackError } = await supabase.from("feedback").insert(feedbackData).select()

		if (feedbackError) throw feedbackError
		console.log(`✅ Created ${feedback.length} feedback entries`)

		console.log("🎉 Database seeding completed successfully!")

		return {
			categories: categories.length,
			sources: sources.length,
			expenses: expenses.length,
			feedback: feedback.length,
		}
	} catch (error) {
		console.error("❌ Error seeding database:", error)
		throw error
	}
}

// Helper function to run seeding (useful for npm scripts)
export async function runSeed() {
	try {
		const results = await seedDatabase()
		console.log("📊 Seeding Results:", results)
		process.exit(0)
	} catch (error) {
		console.error("Failed to seed database:", error)
		process.exit(1)
	}
}

// Run seeding if this file is executed directly
if (require.main === module) {
	runSeed()
}
