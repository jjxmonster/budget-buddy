import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { Metadata } from "next"
import { getQueryClient } from "@/lib/get-query-client"
import { getCategories } from "@/services/category.service"
import { CategoryList } from "./_components/category-list"

export const metadata: Metadata = {
	title: "Categories | Budget Buddy",
	description: "Manage your expense categories with Budget Buddy",
}

export default async function CategoriesPage() {
	const queryClient = getQueryClient()

	await queryClient.prefetchQuery({
		queryKey: ["categories"],
		queryFn: getCategories,
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className="container mx-auto py-6">
				<CategoryList />
			</div>
		</HydrationBoundary>
	)
}
