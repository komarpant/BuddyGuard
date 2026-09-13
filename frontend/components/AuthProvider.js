"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, usePathname } from "next/navigation";
import api from "@/lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ alias: "Buddy", avatar: "B" });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("buddyguard_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        fetchProfile(parsedUser.id);
      } catch (err) {
        localStorage.removeItem("buddyguard_user");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem("buddyguard_user", JSON.stringify(userData));
    setUser(userData);
    fetchProfile(userData.id);
  };

  const logout = () => {
    localStorage.removeItem("buddyguard_user");
    setUser(null);
    setProfile(null);
    router.push("/login");
  };

  const fetchProfile = async (userId) => {
    try {
      const response = await api.get(`/api/profile/${userId}`);
      if (response?.profile) {
        setProfile(response.profile);
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return;
    try {
      const response = await api.post("/api/profile", {
        user_id: user.id,
        ...profile,
        ...updates
      });
      setProfile(response.profile);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  // Protect routes based on auth state
  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== "/login" && pathname !== "/signup") {
        router.push("/login");
      } else if (user && (pathname === "/login" || pathname === "/signup")) {
        router.push("/");
      }
    }
  }, [user, loading, pathname, router]);


  return (
    <AuthContext.Provider value={{ user, loading, profile, updateProfile, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
