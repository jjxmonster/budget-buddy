import { redirect } from "next/navigation"
import { createClient } from "@/db/supabase.client"

export default async function DashboardPage() {
	const supabase = await createClient()
	const { data, error } = await supabase.auth.getUser()

	if (error || !data?.user) {
		redirect("/auth/login")
	}

	return redirect("/dashboard/expenses")
}
