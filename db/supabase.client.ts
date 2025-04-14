import { createClient } from "@supabase/supabase-js"
import { env } from "@/env.mjs"

const supabaseUrl = env.SUPABASE_URL
const supabaseKey = env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase

export const DEFAULT_USER_ID = "e34f411a-6c4c-46d8-844f-c6f2fcc8b6f6"
