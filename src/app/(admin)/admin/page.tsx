"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = () => {
      if (typeof window !== "undefined") {
        // Check if user is authenticated
        const isAuthenticated = document.cookie.includes(
          "admin-token=authenticated",
        );

        if (isAuthenticated) {
          // If logged in, redirect to dashboard
          router.replace("/admin/dashboard");
        } else {
          // If not logged in, redirect to login
          router.replace("/admin/login");
        }
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="text-center text-white">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p className="text-lg">Yo&rsquo;naltirilmoqda...</p>
      </div>
    </div>
  );
}
