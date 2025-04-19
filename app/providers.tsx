"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/get-query-client"

export const Providers = ({ children }: { children: React.ReactNode }) => {
	const queryClient = getQueryClient()
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
