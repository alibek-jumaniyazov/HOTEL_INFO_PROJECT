"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { AuthAPI } from "@/lib/api";

interface AdminContextType {
  isAuthenticated: boolean;
  logout: () => void;
  isLoading: boolean;
  user: Record<string, unknown> | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    const checkAuth = () => {
      const authenticated = AuthAPI.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await AuthAPI.logout();
      setIsAuthenticated(false);
      setUser(null);
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout error:", error);
      setIsAuthenticated(false);
      setUser(null);
      window.location.href = "/admin/login";
    }
  };

  // ⛔️ Hydration error oldini olish uchun
  if (!hasMounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={{ isAuthenticated, logout, isLoading, user }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
