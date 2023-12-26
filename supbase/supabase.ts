import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
export const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
