import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ChefHat, ArrowRight, ShieldCheck, Users, Utensils, Check, X } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { USER_ROLES } from '../../utils/constants';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isLoading, getRoleRedirect } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: USER_ROLES.CUSTOMER,
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

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
    } else {
      const pw = formData.password;
      const failedRules = [];
      if (pw.length < 6) failedRules.push('at least 6 characters');
      if (!/[a-zA-Z]/.test(pw)) failedRules.push('a letter');
      if (!/[0-9]/.test(pw)) failedRules.push('a number');
      if (!/[!@#$%^&*()_+\-={}|;':",./<>?[\]\\`~]/.test(pw)) failedRules.push('a special character');
      if (failedRules.length > 0) {
        newErrors.password = `Still needs: ${failedRules.join(', ')}`;
      }
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await signup(
      formData.name,
      formData.email,
      formData.password,
      formData.role
    );

    if (result.success) {
      toast.success(`Welcome, ${result.user.name}! Account created.`);
      navigate(getRoleRedirect());
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
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-surface-dark-deep overflow-y-auto">
        <div className="w-full max-w-md animate-slide-up py-8">
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
              onChange={handleInputChange}
              error={formErrors.name}
              icon={User}
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              error={formErrors.email}
              icon={Mail}
            />

            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Register as
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: USER_ROLES.CUSTOMER, label: 'Customer', icon: User },
                  { id: USER_ROLES.KITCHEN_STAFF, label: 'Kitchen', icon: ChefHat },
                  { id: USER_ROLES.ADMIN, label: 'Admin', icon: ShieldCheck },
                ].map((role) => {
                  const Icon = role.icon;
                  const isSelected = formData.role === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: role.id }))}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all group ${isSelected
                          ? 'border-brand-orange bg-brand-orange/5 text-brand-orange shadow-sm'
                          : 'border-gray-100 dark:border-gray-800 hover:border-brand-orange/30 text-gray-500 dark:text-gray-400'
                        }`}
                    >
                      <Icon className={`w-5 h-5 mb-1.5 transition-transform group-hover:scale-110 ${isSelected ? 'text-brand-orange' : ''}`} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{role.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              error={formErrors.password}
              icon={Lock}
            />

            {/* Compact Password Strength — 2x2 grid, auto-hides when all pass */}
            {formData.password.length > 0 && (() => {
              const rules = [
                { label: '6+ chars', passed: formData.password.length >= 6 },
                { label: 'A letter', passed: /[a-zA-Z]/.test(formData.password) },
                { label: 'A number', passed: /[0-9]/.test(formData.password) },
                { label: 'Special (!@#..)', passed: /[!@#$%^&*()_+\-={}|;':\",./<>?\[\]\\`~]/.test(formData.password) },
              ];
              const allPassed = rules.every(r => r.passed);
              return allPassed ? (
                <p className="-mt-2 text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Strong password ✓
                </p>
              ) : (
                <div className="-mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                  {rules.map((rule) => (
                    <span key={rule.label} className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${rule.passed ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                      {rule.passed ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0" />}
                      {rule.label}
                    </span>
                  ))}
                </div>
              );
            })()}

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={formErrors.confirmPassword}
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
