import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ajkgndgdwsbglnirzynn.supabase.co";
const supabaseKey = "sb_publishable_ed2YbwJLaNOrBPFduH--AQ_6UF0RE0S";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: true,
  },
});