"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
	return (
		<div className="flex min-h-screen flex-col">
			{/* Navigation Bar */}
			<nav className="bg-background/95 sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b px-4 backdrop-blur sm:px-8 md:px-12">
				<div className="flex items-center gap-2">
					<span className="text-xl font-bold">BudgetBuddy</span>
				</div>
				<div className="flex items-center gap-4">
					<Link href="/auth/login">
						<Button variant="outline">Login</Button>
					</Link>
					<Link href="/auth/register">
						<Button>Sign Up</Button>
					</Link>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="flex flex-col items-center justify-center gap-8 px-4 py-16 text-center md:py-24 lg:py-32">
				<div className="flex max-w-3xl flex-col gap-4">
					<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
						Take Control of Your <span className="text-primary">Finances</span>
					</h1>
					<p className="text-muted-foreground mx-auto max-w-[700px] text-lg">
						Track expenses, manage your budget, and get AI-powered insights to help you make smarter financial
						decisions.
					</p>
				</div>
				<div className="flex flex-col gap-4 sm:flex-row">
					<Link href="/auth/register">
						<Button size="lg" className="px-8">
							Get Started
						</Button>
					</Link>
					<Link href="#features">
						<Button size="lg" variant="outline" className="px-8">
							Learn More
						</Button>
					</Link>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="bg-muted/50 px-4 py-16 md:py-24">
				<div className="mx-auto max-w-7xl">
					<h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
						Everything You Need to Manage Your Budget
					</h2>
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{/* Feature Card 1 */}
						<div className="bg-card flex flex-col rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
							<div className="bg-primary/10 mb-4 w-fit rounded-full p-3">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="text-primary"
								>
									<rect width="20" height="14" x="2" y="5" rx="2" />
									<line x1="2" x2="22" y1="10" y2="10" />
								</svg>
							</div>
							<h3 className="mb-2 text-xl font-bold">Expense Tracking</h3>
							<p className="text-muted-foreground">
								Easily add, edit, and categorize your expenses to keep track of where your money is going.
							</p>
						</div>

						{/* Feature Card 2 */}
						<div className="bg-card flex flex-col rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
							<div className="bg-primary/10 mb-4 w-fit rounded-full p-3">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="text-primary"
								>
									<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
									<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
								</svg>
							</div>
							<h3 className="mb-2 text-xl font-bold">Category Management</h3>
							<p className="text-muted-foreground">
								Create and manage custom categories to organize your expenses in a way that makes sense for you.
							</p>
						</div>

						{/* Feature Card 3 */}
						<div className="bg-card flex flex-col rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
							<div className="bg-primary/10 mb-4 w-fit rounded-full p-3">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="text-primary"
								>
									<circle cx="12" cy="12" r="10" />
									<line x1="12" x2="12" y1="8" y2="12" />
									<line x1="12" x2="12.01" y1="16" y2="16" />
								</svg>
							</div>
							<h3 className="mb-2 text-xl font-bold">AI Insights</h3>
							<p className="text-muted-foreground">
								Get intelligent answers about your spending habits and expense history from our AI assistant.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-background text-muted-foreground border-t px-4 py-8 text-center text-sm">
				<p>© {new Date().getFullYear()} BudgetBuddy. All rights reserved.</p>
			</footer>
		</div>
	)
}
