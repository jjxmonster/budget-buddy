import { createClient } from "@supabase/supabase-js"
import { env } from "@/env.mjs"

const supabaseUrl = env.SUPABASE_URL
const supabaseKey = env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
