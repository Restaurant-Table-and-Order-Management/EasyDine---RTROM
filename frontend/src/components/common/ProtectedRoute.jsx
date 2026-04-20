import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { ROLE_REDIRECT } from '../../utils/constants';

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requiredRole = null,
  redirectTo = '/login',
}) {
  const { isAuthenticated, user } = useAuthStore();

  // Public-only pages: redirect to role-based dashboard if logged in
  if (!requireAuth && isAuthenticated) {
    const role = user?.role || 'CUSTOMER';
    const dest = ROLE_REDIRECT[role] || '/dashboard';
    return <Navigate to={dest} replace />;
  }

  // Protected pages: redirect to login if not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Role-restricted pages
  const isAuthorized = Array.isArray(requiredRole) 
    ? requiredRole.includes(user?.role)
    : user?.role === requiredRole;

  if (requiredRole && !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark-deep">
        <div className="text-center p-8 bg-white dark:bg-surface-dark rounded-2xl shadow-lg max-w-sm mx-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <span className="text-3xl">🚫</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            You don&apos;t have permission to view this page.
          </p>
          <a
            href={ROLE_REDIRECT[user?.role] || '/dashboard'}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-brand-orange hover:text-brand-orange-dark transition-colors"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
}
