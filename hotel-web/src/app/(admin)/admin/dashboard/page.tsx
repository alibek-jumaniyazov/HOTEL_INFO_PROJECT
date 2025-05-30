import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"
import DashboardStats from "@/components/admin/dashboard-stats"
import RecentMessages from "@/components/admin/recent-messages"
import QuickActions from "@/components/admin/quick-actions"

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
{/* 
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Hotel boshqaruv paneli</p>
            </div>

            <DashboardStats />

            <div className="grid lg:grid-cols-3 gap-8 mt-8">
              <div className="lg:col-span-2">
                <RecentMessages />
              </div>
              <div>
                <QuickActions />
              </div>
            </div>
          </div>
        </main>
      </div> */}
    </div>
  )
}
