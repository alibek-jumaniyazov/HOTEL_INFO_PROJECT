"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, User, Eye, EyeOff, Home, Loader2 } from "lucide-react";
import Link from "next/link";
import { AuthAPI, type LoginCredentials } from "@/lib/api";

const API_BASE_URL = "http://localhost:3001/api";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    name: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Check if already logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuthenticated = AuthAPI.isAuthenticated();
      if (isAuthenticated) {
        router.replace("/admin/rooms");
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await AuthAPI.login(credentials);

      if (response.success) {
        router.push("/admin/rooms");
      } else {
        setError(response.error || "Login jarayonida xatolik yuz berdi");
      }
    } catch (error) {
      setError("Serverga ulanishda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Back to site button */}
      <Link href="/" className="absolute top-4 left-4 z-20">
        <Button variant="ghost" className="text-white hover:bg-white/20">
          <Home className="w-4 h-4 mr-2" />
          Saytga qaytish
        </Button>
      </Link>

      <Card className="w-full max-w-md mx-4 relative z-10 shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Admin Panel
          </CardTitle>
          <p className="text-gray-600">Luxury Hotel boshqaruv tizimi</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ism</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  value={credentials.name}
                  onChange={(e) =>
                    setCredentials({ ...credentials, name: e.target.value })
                  }
                  placeholder="Ismingizni kiriting"
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Parol</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Kirish...
                </>
              ) : (
                "Kirish"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-blue-600"
            >
              Asosiy saytga qaytish
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
