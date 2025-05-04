import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { env } from "@/env.mjs"

const supabaseUrl = env.SUPABASE_URL
const supabaseKey = env.SUPABASE_KEY

export async function createClient() {
	const cookieStore = await cookies()

	return createServerClient(supabaseUrl, supabaseKey, {
		cookies: {
			getAll() {
				return cookieStore.getAll()
			},
			setAll(cookiesToSet) {
				try {
					cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
				} catch {
					// The `setAll` method was called from a Server Component.
					// This can be ignored if you have middleware refreshing
					// user sessions.
				}
			},
		},
	})
}
