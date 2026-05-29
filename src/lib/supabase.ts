import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mlnpatjyvxzmyeccochb.supabase.co";
const supabaseAnonKey = "sb_publishable_6dMfV-Y1Aqgfd4PgKw4kUA_p7giJR2k"; // your full anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
