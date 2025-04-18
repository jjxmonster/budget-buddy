import { ReactNode } from "react"
import { Providers } from "@/app/providers"
import { MobileSidebar, Sidebar } from "./_components/dashboard-sidebar"

interface DashboardLayoutProps {
	children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<div className="min-h-screen">
			<Sidebar />
			<div className="flex min-h-screen flex-col lg:pl-72">
				<header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
					<div className="container flex h-14 items-center gap-4">
						<MobileSidebar />
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
