import { useAuthStore } from '../../store/authStore'

export default function KitchenDashboard() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <div className="min-h-screen bg-green-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 text-green-600">Kitchen Dashboard</h1>
          <button 
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8">
          <p className="text-xl text-green-700">
            Welcome, <span className="font-bold">{user?.name}</span> (Kitchen Chef)
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-2">Order Queue</h3>
            <p className="text-gray-500 text-sm">View and prioritize preparation tasks.</p>
          </div>
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-2">Inventory Alerts</h3>
            <p className="text-gray-500 text-sm">Monitor stock for essential ingredients.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
