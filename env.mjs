import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
	server: {
		SUPABASE_URL: z.string(),
		SUPABASE_KEY: z.string(),
		OPENROUTER_API_KEY: z.string(),
	},
	runtimeEnv: {
		SUPABASE_URL: process.env.SUPABASE_URL,
		SUPABASE_KEY: process.env.SUPABASE_KEY,
		OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
	},
})
