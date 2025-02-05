import { createClient } from "@supabase/supabase-js";
import { env } from "@/config/env";
import { Database } from "@/types/supabase";

// Create Supabase client
export const supabase = createClient<Database>(
  env.supabase.url,
  env.supabase.anonKey
);
