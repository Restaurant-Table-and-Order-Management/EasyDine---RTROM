import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ChefHat, CheckCircle2 } from 'lucide-react';
import { authApi } from '../../api/authApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Simulate/Call API
      await authApi.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-surface-light dark:bg-surface-dark-deep flex flex-col justify-center py-12 px-6 lg:px-8 animate-fade-in">
        <div className="max-w-md w-full mx-auto">
          <Card className="text-center p-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              We've sent a password reset link to <span className="font-semibold text-gray-900 dark:text-white">{email}</span>.
            </p>
            
            <div className="mb-8 p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-xl text-left">
              <p className="text-[10px] font-black text-orange-800 dark:text-orange-400 uppercase tracking-widest mb-2">Simulated Reset Link (Development Only)</p>
              <Link 
                to="/reset-password?token=dummy-token" 
                className="text-xs font-bold text-orange-600 hover:underline break-all"
              >
                Click here to reset password (Simulation)
              </Link>
            </div>

            <Link to="/login">
              <Button fullWidth variant="outline">
                Back to Login
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark-deep flex flex-col justify-center py-12 px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-orange to-brand-gold flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-orange/20">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Forgot Password?</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        <Card>
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/30 flex items-start gap-3">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={Mail}
              disabled={isLoading}
              required
            />

            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              size="lg"
            >
              Reset Password
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-brand-orange transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
