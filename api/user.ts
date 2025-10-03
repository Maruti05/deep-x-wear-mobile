import { supabase } from "@/app/lib/supabase";
import { User } from "@/app/types/User";

// queries/users.ts
export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId) // use 'id' or your Supabase column
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function insertUser(user: {
  id: string;
  full_name?: string;
  phone_number?: string;
  role?: string;
  email?: string;
}) {
  const { data, error } = await supabase.from("users").insert(user).single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateUser(userId: string, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}
