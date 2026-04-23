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
      navigate(getRoleRedirect(), { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-light dark:bg-surface-dark-deep">
      {/* Left panel — Branding (hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 relative p-12 flex-col justify-center overflow-hidden bg-black">
        {/* Full-bleed background image with a dark vignette */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>

        {/* Floating Mockup UI */}
        <div className="absolute top-[12%] right-[8%] bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl animate-float opacity-90 rotate-2 z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">✓</div>
            <div>
              <p className="text-xs font-bold text-white">Table 4 Ready</p>
              <p className="text-[10px] text-white/50">Kitchen synchronized</p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-[8%] left-[8%] bg-black/40 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-2xl animate-float-delayed opacity-90 -rotate-3 z-20">
           <div className="flex justify-between items-end gap-8">
              <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Live Revenue</p>
                 <p className="text-2xl font-black text-white">₹42,850</p>
              </div>
              <div className="w-12 h-10 flex items-end gap-1.5">
                 <div className="w-full bg-brand-orange/60 h-1/2 rounded-t-sm"></div>
                 <div className="w-full bg-brand-orange/80 h-3/4 rounded-t-sm"></div>
                 <div className="w-full bg-brand-orange h-full rounded-t-sm"></div>
              </div>
           </div>
        </div>

        <div className="relative z-10 max-w-md mx-auto text-center text-white -mt-10">
          <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-8 shadow-2xl hover:scale-105 transition-transform">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold mb-6 tracking-tight">Welcome to EasyDine</h1>
          
          <div className="pt-8 mt-8 border-t border-white/10 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-transparent px-4">
               <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
            </div>
            <p className="text-lg font-medium text-white/80 leading-relaxed italic">
              "A comprehensive ecosystem for modern restaurant management, integrating front-of-house service with back-of-house efficiency."
            </p>
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
                <Link to="/signup" replace className="text-brand-orange hover:text-brand-orange-dark font-semibold transition-colors">
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
