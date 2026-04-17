import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ChefHat, ArrowRight } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await signup(formData.name, formData.email, formData.password);
    if (result.success) {
      toast.success(`Welcome, ${result.user.name}! Account created.`);
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-orange-900 via-brand-orange-dark to-brand-orange items-center justify-center p-12">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Join EasyDine Today
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Create your account and start managing reservations in minutes. No credit card required.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <p className="text-2xl mb-1">⚡</p>
              <p className="text-sm text-white/80">Quick Setup</p>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <p className="text-2xl mb-1">🔒</p>
              <p className="text-sm text-white/80">Secure</p>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <p className="text-2xl mb-1">📱</p>
              <p className="text-sm text-white/80">Mobile Ready</p>
            </div>
          </div>
        </div>
        <div className="absolute top-20 right-20 w-40 h-40 rounded-full bg-white/5 blur-xl" />
        <div className="absolute bottom-20 left-20 w-60 h-60 rounded-full bg-white/5 blur-xl" />
      </div>

      {/* Right side — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-surface-dark-deep">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center shadow-lg shadow-brand-orange/20">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                EasyDine
              </h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                RTROM
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Create your account
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Start managing your restaurant reservations
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              icon={User}
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={Mail}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={Lock}
              helperText="Minimum 6 characters"
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={Lock}
            />

            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              size="lg"
            >
              Create Account
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-brand-orange hover:text-brand-orange-dark dark:text-brand-gold dark:hover:text-brand-gold-light transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
