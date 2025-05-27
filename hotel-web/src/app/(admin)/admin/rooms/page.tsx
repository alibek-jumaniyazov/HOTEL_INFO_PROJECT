import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"
import RoomsManagement from "@/components/admin/rooms-management"

export default function RoomsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Xonalar Boshqaruvi</h1>
              <p className="text-gray-600">Hotel xonalarini boshqaring va yangilashtiring</p>
            </div>

            <RoomsManagement />
          </div>
        </main>
      </div>
    </div>
  )
}
