"use client"

import { CreditCard, LayoutDashboard, Receipt, Tag } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/utils/helpers"

interface SidebarItem {
	name: string
	href: string
	icon: typeof LayoutDashboard
}

const sidebarItems: SidebarItem[] = [
	{
		name: "Expenses",
		href: "/dashboard/expenses",
		icon: Receipt,
	},
	{
		name: "Categories",
		href: "/dashboard/categories",
		icon: Tag,
	},
	{
		name: "Sources",
		href: "/dashboard/sources",
		icon: CreditCard,
	},
]

export const Sidebar = () => {
	const pathname = usePathname()

	return (
		<nav className="bg-background fixed top-0 left-0 z-40 hidden h-screen w-72 border-r lg:block">
			<div className="flex h-full flex-col gap-4 p-6">
				<div className="flex items-center gap-2">
					<h1 className="text-xl font-bold">Budget Buddy</h1>
				</div>
				<Separator />
				<div className="flex-1 space-y-1">
					{sidebarItems.map((item) => {
						const isActive = pathname === item.href
						return (
							<Button
								key={item.href}
								variant={isActive ? "secondary" : "ghost"}
								className={cn("w-full justify-start", isActive && "bg-secondary")}
								asChild
							>
								<Link href={item.href}>
									<item.icon className="mr-2 h-4 w-4" />
									{item.name}
								</Link>
							</Button>
						)
					})}
				</div>
			</div>
		</nav>
	)
}

export const MobileSidebar = () => {
	const pathname = usePathname()

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" size="icon" className="lg:hidden">
					<LayoutDashboard className="h-4 w-4" />
					<span className="sr-only">Toggle sidebar</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="w-72 p-0">
				<SheetHeader className="p-6">
					<SheetTitle>Budget Buddy</SheetTitle>
				</SheetHeader>
				<Separator />
				<div className="flex-1 space-y-1 p-6">
					{sidebarItems.map((item) => {
						const isActive = pathname === item.href
						return (
							<Button
								key={item.href}
								variant={isActive ? "secondary" : "ghost"}
								className={cn("w-full justify-start", isActive && "bg-secondary")}
								asChild
							>
								<Link href={item.href}>
									<item.icon className="mr-2 h-4 w-4" />
									{item.name}
								</Link>
							</Button>
						)
					})}
				</div>
			</SheetContent>
		</Sheet>
	)
}
