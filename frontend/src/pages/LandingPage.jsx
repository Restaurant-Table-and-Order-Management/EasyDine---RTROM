import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            Welcome to <span className="text-primary">EasyDine</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive restaurant management system designed to simplify your operations and enhance customer experience.
          </p>
          
          <div className="flex gap-4 justify-center pt-8">
            <Link
              to="/login"
              className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-primary border-2 border-primary rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Register
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Menu Management</h3>
              <p className="text-gray-600">Easily manage and organize your restaurant menu items</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Tracking</h3>
              <p className="text-gray-600">Real-time order management and status updates</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-gray-600">Comprehensive insights into your business performance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
