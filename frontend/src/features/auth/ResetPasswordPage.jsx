import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ChefHat, CheckCircle2 } from 'lucide-react';
import { authApi } from '../../api/authApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await authApi.resetPassword(token || 'dummy-token', password);
      setIsSuccess(true);
      toast.success('Password reset successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Link may be expired.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-surface-light dark:bg-surface-dark-deep flex flex-col justify-center py-12 px-6 lg:px-8 animate-fade-in">
        <div className="max-w-md w-full mx-auto">
          <Card className="text-center p-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Password Reset!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Your password has been successfully updated. You can now log in with your new password.
            </p>
            <Button onClick={() => navigate('/login')} fullWidth>
              Go to Login
            </Button>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Password</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Please enter your new password below.
          </p>
        </div>

        <Card>
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/30">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="New Password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
              disabled={isLoading}
              required
            />

            <Input
              label="Confirm New Password"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
              disabled={isLoading}
              required
            />

            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              size="lg"
            >
              Update Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
