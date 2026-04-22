import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard if they try to access a restricted one
    const role = user.role
    if (role === 'ADMIN') return <Navigate to="/dashboard/admin" replace />
    if (role === 'WAITER') return <Navigate to="/dashboard/waiter" replace />
    if (role === 'KITCHEN_STAFF') return <Navigate to="/dashboard/kitchen" replace />
    return <Navigate to="/dashboard/customer" replace />
  }

  return children
}
