import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Navigation() {
  const { isAuthenticated, user, logout } = useAuthStore()

  const getDashboardLink = () => {
    if (!user) return '/dashboard'
    const role = user.role
    if (role === 'ADMIN') return '/dashboard/admin'
    if (role === 'WAITER') return '/dashboard/waiter'
    if (role === 'KITCHEN_STAFF') return '/dashboard/kitchen'
    return '/dashboard/customer'
  }

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent hover:scale-105 transition-transform">
            EasyDine
          </Link>

          <div className="flex gap-6 items-center">
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} className="text-gray-600 font-medium hover:text-indigo-600 transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary transition">
                  Login
                </Link>
                <Link to="/register" className="text-gray-600 hover:text-primary transition">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
