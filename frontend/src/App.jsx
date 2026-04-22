import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Auth pages
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';

// Feature pages
// import DashboardPage from './pages/DashboardPage'; // Let's create specific dashboard pages for each role or a smart one.
import AdminDashboard from './pages/dashboard/AdminDashboard';
import KitchenDashboard from './pages/dashboard/KitchenDashboard';
import CustomerDashboard from './pages/dashboard/CustomerDashboard';

import NotFoundPage from './pages/NotFoundPage';
import LandingPage from './pages/LandingPage';
import TableSearchPage from './features/tables/TableSearchPage';
import TableManagementPage from './features/tables/TableManagementPage';
import MyReservationsPage from './features/reservations/MyReservationsPage';
import AdminReservationsPage from './features/reservations/AdminReservationsPage';
import MenuManagementPage from './features/menu/MenuManagementPage';
import CustomerMenuPage from './features/orders/CustomerMenuPage';
import OrderTrackingPage from './features/orders/OrderTrackingPage';

// Guards
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            background: '#1e1e1e',
            color: '#fff',
            fontSize: '14px',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public routes — redirect to dashboard if logged in */}
          <Route
            path="/login"
            element={
              <ProtectedRoute requireAuth={false}>
                <LoginPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <ProtectedRoute requireAuth={false}>
                <SignupPage />
              </ProtectedRoute>
            }
          />

          {/* Protected dashboard layout routes */}
          <Route
            element={
              <ProtectedRoute requireAuth={true}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* ADMIN ROUTES */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tables"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="ADMIN">
                  <TableManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reservations"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="ADMIN">
                  <AdminReservationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/menu"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="ADMIN">
                  <MenuManagementPage />
                </ProtectedRoute>
              }
            />

            {/* STAFF ROUTES */}
            <Route
              path="/staff/dashboard"
              element={
                <ProtectedRoute requireAuth={true} requiredRole={['STAFF', 'KITCHEN_STAFF']}>
                  <KitchenDashboard />
                </ProtectedRoute>
              }
            />

            {/* CUSTOMER ROUTES */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="CUSTOMER">
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/menu"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="CUSTOMER">
                  <CustomerMenuPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tables"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="CUSTOMER">
                  <TableSearchPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-reservations"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="CUSTOMER">
                  <MyReservationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-track/:id"
              element={
                <ProtectedRoute requireAuth={true} requiredRole="CUSTOMER">
                  <OrderTrackingPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Redirects & fallbacks */}
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
