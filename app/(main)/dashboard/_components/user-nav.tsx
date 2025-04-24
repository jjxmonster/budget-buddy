"use client"

import { LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { logout } from "@/app/auth/login/actions"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserNavProps {
	userEmail: string
}

export function UserNav({ userEmail }: UserNavProps) {
	const router = useRouter()

	const handleLogout = async () => {
		try {
			await logout()

			toast.success("Logged out successfully")
			router.push("/auth/login")
		} catch (error) {
			console.log(error)
			toast.error("Error logging out")
		}
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-8 w-8 rounded-full">
					<User className="h-5 w-5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm leading-none font-medium">Account</p>
						<p className="text-muted-foreground text-xs leading-none">{userEmail}</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleLogout}>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
