import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"
import { env } from "@/env.mjs"

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	})

	const supabase = createServerClient(env.SUPABASE_URL, env.SUPABASE_KEY, {
		cookies: {
			getAll() {
				return request.cookies.getAll()
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
				supabaseResponse = NextResponse.next({
					request,
				})
				cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
			},
		},
	})

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user && !request.nextUrl.pathname.startsWith("/login") && !request.nextUrl.pathname.startsWith("/auth")) {
		// no user, potentially respond by redirecting the user to the login page
		const url = request.nextUrl.clone()
		url.pathname = "/auth/login"
		return NextResponse.redirect(url)
	}

	return supabaseResponse
}
