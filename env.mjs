import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
	server: {
		SUPABASE_URL: z.url(),
		SUPABASE_KEY: z.string(),
	},
	client: {
		NEXT_PUBLIC_SUPABASE_URL: z.string(),
	},
	runtimeEnv: {
		SUPABASE_URL: process.env.SUPABASE_URL,
		SUPABASE_KEY: process.env.SUPABASE_KEY,
		NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
	},
})
