import { redirect } from "next/navigation"
import { createClient } from "@/db/supabase.client"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (user) {
		redirect("/dashboard/expenses")
	}

	return <>{children}</>
}
