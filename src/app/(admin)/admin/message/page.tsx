import AdminHeader from "@/components/admin/admin-header";
import AdminSidebar from "@/components/admin/admin-sidebar";
import MessagesManagement from "@/components/admin/messages-management";

export default function MessagesPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Xabarlar</h1>
              <p className="text-gray-600">
                Mijozlardan kelgan xabarlarni ko&rsquo;ring va javob bering
              </p>
            </div>

            <MessagesManagement />
          </div>
        </main>
      </div>
    </div>
  );
}
