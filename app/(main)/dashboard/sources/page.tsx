import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { Metadata } from "next"
import { getSources } from "@/services/source.service"
import { getQueryClient } from "@/utils/get-query-client"
import { SourceList } from "./_components/source-list"

export const metadata: Metadata = {
	title: "Sources | Budget Buddy",
	description: "Manage your expense sources with Budget Buddy",
}

export default async function SourcesPage() {
	const queryClient = getQueryClient()

	await queryClient.prefetchQuery({
		queryKey: ["sources"],
		queryFn: getSources,
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className="container mx-auto py-6">
				<SourceList />
			</div>
		</HydrationBoundary>
	)
}
