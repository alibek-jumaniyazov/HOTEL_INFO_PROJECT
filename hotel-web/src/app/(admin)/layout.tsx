import type React from "react";
import { AdminProvider } from "@/components/admin/admin-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-gray-50">{children}</div>
    </AdminProvider>
  );
}
