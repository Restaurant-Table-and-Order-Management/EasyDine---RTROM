import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ChefHat } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark-deep p-6">
      <div className="text-center max-w-md animate-slide-up">
        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-orange/20 to-brand-gold/20 flex items-center justify-center">
          <ChefHat className="w-12 h-12 text-brand-orange" />
        </div>

        <h1 className="text-7xl font-bold text-gray-200 dark:text-gray-700 mb-2">
          404
        </h1>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <Link to="/dashboard">
          <Button size="lg">
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
