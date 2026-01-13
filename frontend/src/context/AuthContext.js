"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext({});

// Cache keys
const MENTOR_CACHE_KEY = 'campus_connect_is_mentor';

// Helper function to ensure profile exists (non-blocking)
function ensureProfileExists(user) {
  if (!user?.id) return;

  // Run in background, don't await
  supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle()
    .then(({ data: existingProfile }) => {
      if (!existingProfile) {
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || '';
        supabase
          .from("profiles")
          .insert({
            id: user.id,
            email: user.email,
            full_name: fullName,
            role: 'user',
          })
          .then(({ error }) => {
            if (error && error.code !== '23505') {
              console.error("Error creating profile:", error);
            }
          });
      }
    })
    .catch(err => console.error("Error ensuring profile exists:", err));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMentor, setIsMentor] = useState(() => {
    // Initialize from cache
    if (typeof window !== 'undefined') {
      return localStorage.getItem(MENTOR_CACHE_KEY) === 'true';
    }
    return false;
  });

  // Check if user is a mentor (with caching)
  async function checkMentorStatus(email) {
    if (!email) {
      setIsMentor(false);
      localStorage.removeItem(MENTOR_CACHE_KEY);
      return;
    }

    try {
      const { data } = await supabase
        .from("mentors")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      const mentorStatus = !!data;
      setIsMentor(mentorStatus);

      // Cache the result
      if (mentorStatus) {
        localStorage.setItem(MENTOR_CACHE_KEY, 'true');
      } else {
        localStorage.removeItem(MENTOR_CACHE_KEY);
      }
    } catch (err) {
      console.error("Error checking mentor status:", err);
      // Keep cached value on error
    }
  }

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setLoading(false);

        // Check mentor status on initial load
        if (currentUser?.email) {
          checkMentorStatus(currentUser.email);
        } else {
          // No user, clear cache
          setIsMentor(false);
          localStorage.removeItem(MENTOR_CACHE_KEY);
        }
      } catch (err) {
        console.error("Error getting session:", err);
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setLoading(false);

        if (currentUser && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          // Non-blocking profile check
          ensureProfileExists(currentUser);
          // Check mentor status
          checkMentorStatus(currentUser.email);
        }

        if (event === 'SIGNED_OUT') {
          setIsMentor(false);
          localStorage.removeItem(MENTOR_CACHE_KEY);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    // Clear state immediately
    setUser(null);
    setIsMentor(false);
    localStorage.removeItem(MENTOR_CACHE_KEY);

    // Then sign out (don't wait if it's slow)
    supabase.auth.signOut().catch(err => {
      console.error("Sign out error:", err);
    });
  };

  const value = {
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
    isMentor,
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
