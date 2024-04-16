import supabase from "@/supbase/supabase";

export const loginUser = async (payload: {
  email: string;
  password: string;
}) => {
  return await supabase.auth.signInWithPassword(payload);
};
