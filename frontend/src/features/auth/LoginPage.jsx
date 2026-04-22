import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ChefHat, ArrowRight } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const { login, isLoading, error, clearError, getRoleRedirect } = useAuthStore();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (error) clearError();
  };

  const validate = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validate()) return;
    
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate(getRoleRedirect());
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-light dark:bg-surface-dark-deep">
      {/* Left panel — Branding (hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-brand-orange to-brand-orange-dark p-12 flex-col justify-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative z-10 max-w-md mx-auto text-center text-white">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-8 shadow-xl">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-6">Welcome to EasyDine</h1>
          <p className="text-lg text-white/80 leading-relaxed mb-10">
            Manage your restaurant reservations with ease. Smart table management, seamless bookings, happy guests.
          </p>

          <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/20">
            <div>
              <p className="text-3xl font-bold mb-1">500+</p>
              <p className="text-sm text-white/70">Restaurants</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">10K+</p>
              <p className="text-sm text-white/70">Reservations</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">99%</p>
              <p className="text-sm text-white/70">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 animate-fade-in relative">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile brand header */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-orange to-brand-gold flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-orange/20">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EasyDine</h1>
          </div>

          <Card className="w-full">
            <div className="mb-8 p-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sign in to your account</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Enter your credentials to access your dashboard</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/30 flex items-start gap-3 animate-shake">
                <span className="mt-0.5">⚠️</span>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <Input
                label="Email Address"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={formErrors.email}
                icon={Mail}
                placeholder="you@example.com"
                disabled={isLoading}
                autoComplete="email"
              />

              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={formErrors.password}
                icon={Lock}
                placeholder="••••••••"
                disabled={isLoading}
                autoComplete="current-password"
              />

              <div className="flex justify-end -mt-2">
                <Link 
                  to="/forgot-password" 
                  className="text-xs font-semibold text-brand-orange hover:text-brand-orange-dark transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  fullWidth
                  loading={isLoading}
                  size="lg"
                  className="font-semibold text-lg"
                >
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm">
              <p className="text-gray-500 dark:text-gray-400">
                Don&apos;t have an account?{' '}
                <Link to="/signup" className="text-brand-orange hover:text-brand-orange-dark font-semibold transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
