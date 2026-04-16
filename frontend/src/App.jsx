import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import WaiterDashboard from './pages/dashboard/WaiterDashboard'
import KitchenDashboard from './pages/dashboard/KitchenDashboard'
import CustomerDashboard from './pages/dashboard/CustomerDashboard'

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Navigation />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard/admin" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/waiter" 
          element={
            <ProtectedRoute allowedRoles={['WAITER']}>
              <WaiterDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/kitchen" 
          element={
            <ProtectedRoute allowedRoles={['KITCHEN_STAFF']}>
              <KitchenDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/customer" 
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Fallback for authenticated users trying to access /dashboard */}
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute><Navigate to="/" replace /></ProtectedRoute>} 
        />
      </Routes>
    </Router>
  )
}

export default App
