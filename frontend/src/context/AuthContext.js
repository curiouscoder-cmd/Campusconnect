"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext({});

// Helper function to ensure profile exists
async function ensureProfileExists(user) {
  if (!user?.id) return;

  try {
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    // If no profile, create one
    if (!existingProfile) {
      const fullName = user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        '';

      const { error } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email,
          full_name: fullName,
          role: 'user',
        });

      if (error && error.code !== '23505') { // Ignore duplicate key error
        console.error("Error creating profile:", error);
      } else {
        console.log("Profile created for user:", user.email);
      }
    }
  } catch (err) {
    console.error("Error ensuring profile exists:", err);
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);

        // Ensure profile exists when user signs in
        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          await ensureProfileExists(session.user);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = {
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
