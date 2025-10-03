"use client";

import { useUserDetails } from "@/hooks/useUserDetails";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { verifyRequiredFieldsPresent } from "../lib/utils";
import { AuthContextType, AuthUser } from "../types/Auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = "auth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { getUser } = useUserDetails();

  // Save auth info to secure storage
  const saveAuth = async (authUser: AuthUser, token?: string) => {
    const data = JSON.stringify({ user: authUser, accessToken: token || accessToken });
    await SecureStore.setItemAsync(STORAGE_KEY, data);
  };

  // Load auth info from storage on app start
  const loadAuth = async () => {
  try {
    const stored = await SecureStore.getItemAsync(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user);
      setAccessToken(parsed.accessToken);
    } else {
      // Check Supabase session if not in storage
      const sessionResponse = await supabase.auth.getSession();
      const session = sessionResponse?.data?.session;

      if (!session) {
        setIsLoading(false);
        return; // exit if no session
      }

      const userDetails = await getUser();
      const authUser: AuthUser = {
        id: session?.user?.id,
        email: session?.user?.email!,
        role: session?.user?.user_metadata?.role || "USER",
        email_verified: session?.user?.user_metadata?.email_verified,
        display_name: session?.user?.user_metadata?.display_name || "",
        is_logged_in: true,
        additional_data: userDetails,
        is_profile_completed: verifyRequiredFieldsPresent(userDetails),
        phone_verified: false,
      };

      setUser(authUser);
      setAccessToken(session.access_token);
      await saveAuth(authUser, session.access_token);
    }
  } catch (error) {
    console.error("Failed to load auth:", error);
    logout();
  } finally {
    setIsLoading(false);
  }
};


useEffect(() => {
  loadAuth();

  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_OUT") {
      logout();
    } else if (session?.user) {
      const userDetails = await getUser();
      login({
        user: session.user,
        access_token: session.access_token,
        userDetails,
        is_logged_in: true,
        is_profile_completed: verifyRequiredFieldsPresent(userDetails),
      });
    }
  });

  return () => subscription.unsubscribe();
}, []);


  const login = async (data: Partial<AuthUser> & { access_token?: string; user?: any; userDetails?: any; redirect?: string }) => {
    const prevAuth = user;
    const authUser: AuthUser = {
      ...prevAuth,
      ...(data.user && {
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata?.role || data.user.role || "USER",
        email_verified: data.user.user_metadata?.email_verified,
        display_name: data.user.user_metadata?.display_name || "",
      }),
      ...(data.userDetails && { additional_data: data.userDetails }),
      ...(data.is_logged_in !== undefined && { is_logged_in: data.is_logged_in }),
      ...(data.phone_verified !== undefined && { phone_verified: data.phone_verified }),
      ...(data.is_profile_completed !== undefined && { is_profile_completed: data.is_profile_completed }),
    };

    setUser(authUser);
    if (data.access_token) {
      setAccessToken(data.access_token);
    }

    await saveAuth(authUser, data.access_token);

    if (data.redirect) {
      router.push(data.redirect);
    }
  };

  const logout = async () => {
    setUser(null);
    setAccessToken(null);
    await SecureStore.deleteItemAsync(STORAGE_KEY);
    router.push("/");
  };

  const updateAuth = async (updates: Partial<AuthUser>) => {
    if (!user) return;
    const updatedUser: AuthUser = { ...user, ...updates };
    setUser(updatedUser);
    await saveAuth(updatedUser, accessToken ?? undefined);
  };

  return (
    <AuthContext.Provider value={{ user, access_token: accessToken, login, logout, updateAuth, is_loading: isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// Add default export for expo-router
export default AuthProvider;
