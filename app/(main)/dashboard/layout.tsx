import { redirect } from "next/navigation"
import { ReactNode } from "react"
import { Providers } from "@/app/providers"
import { createClient } from "@/db/supabase.client"
import { MobileSidebar, Sidebar } from "./_components/dashboard-sidebar"
import { UserNav } from "./_components/user-nav"

interface DashboardLayoutProps {
	children: ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
	const supabase = await createClient()
	const { data, error } = await supabase.auth.getUser()

	if (error || !data?.user) {
		redirect("/auth/login")
	}

	return (
		<div className="min-h-screen">
			<Sidebar />
			<div className="flex min-h-screen flex-col lg:pl-72">
				<header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
					<div className="container flex h-14 items-center justify-between">
						<MobileSidebar />
						<UserNav userEmail={data.user.email ?? ""} />
					</div>
				</header>
				<main className="flex-1">
					<Providers>
						<div className="container py-6">{children}</div>
					</Providers>
				</main>
			</div>
		</div>
	)
}
