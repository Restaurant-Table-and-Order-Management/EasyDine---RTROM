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
      navigate(getRoleRedirect(), { replace: true });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side — decorative */}
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
          <h2 className="text-4xl font-extrabold mb-6 tracking-tight">Join EasyDine Today</h2>
          
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

            {/* Role Selection removed, role is fixed to CUSTOMER */}

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
              replace
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
