// hooks/useUserDetails.ts
import { supabase } from "@/app/lib/supabase";
import { User } from "@/app/types/User";
import { useCallback, useState } from "react";

export function useUserDetails() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  // 🔹 GET user by session
 const getUser = useCallback(async () => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await supabase.auth.getUser();
    const sessionUser = response?.data?.user;
    const sessionError = response?.error;

    if (sessionError) throw sessionError;
    if (!sessionUser) throw new Error("Unauthorized");

    const { data: userDetails, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", sessionUser.id)
      .maybeSingle(); // safer than .single()
console.log("userDetails", userDetails,fetchError);

    if (fetchError) throw fetchError;

    setUser(userDetails as User);
    return userDetails;
  } catch (err) {
    setError(err);
    console.error("Get user failed:", err);
    throw err;
  } finally {
    setIsLoading(false);
  }
}, []);


  // 🔹 INSERT new user
  const insertUser = useCallback(async (payload: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: insertError } = await supabase
        .from("users")
        .insert(payload)
        .select()
        .single();

      if (insertError) throw insertError;

      setUser(data as User);
      return data;
    } catch (err) {
      setError(err);
      console.error("Insert user failed:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🔹 UPDATE user
  const updateUser = useCallback(async (payload: Partial<User>) => {
    if (!user) throw new Error("No user logged in");

    setIsLoading(true);
    setError(null);
    try {
      const { data, error: updateError } = await supabase
        .from("users")
        .update(payload)
        .eq("id", user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setUser(data as User);
      return data;
    } catch (err) {
      setError(err);
      console.error("Update user failed:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    user,
    isLoading,
    isError: Boolean(error),
    error,
    getUser,
    insertUser,
    updateUser,
  } as const;
}
