import React, { useEffect, useState } from 'react';
import {
  CalendarCheck,
  Clock,
  Users,
  UtensilsCrossed,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  LayoutGrid,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useDataStore from '../store/dataStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate, formatTime, getTodayDate } from '../utils/dateHelpers';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const {
    reservations,
    reservationsLoading,
    fetchMyReservations,
    fetchAllReservations,
    tables,
    tablesLoading,
    fetchTables,
  } = useDataStore();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (isAdmin) {
      fetchAllReservations('', 'ALL');
      fetchTables();
    } else {
      fetchMyReservations();
    }
  }, [isAdmin, fetchMyReservations, fetchAllReservations, fetchTables]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Customer stats
  const upcomingReservations = reservations.filter(
    (r) =>
      r.reservationDate >= getTodayDate() &&
      (r.status === 'PENDING' || r.status === 'CONFIRMED')
  );
  const totalReservations = reservations.length;
  const confirmedCount = reservations.filter(
    (r) => r.status === 'CONFIRMED'
  ).length;
  const pendingCount = reservations.filter(
    (r) => r.status === 'PENDING'
  ).length;

  // Admin stats
  const totalTables = tables.length;
  const occupiedTables = tables.filter(
    (t) => t.status === 'OCCUPIED'
  ).length;
  const availableTables = tables.filter(
    (t) => t.status === 'AVAILABLE'
  ).length;
  const maintenanceTables = tables.filter(
    (t) => t.status === 'MAINTENANCE'
  ).length;

  const isLoading = reservationsLoading || (isAdmin && tablesLoading);

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." />;
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {getGreeting()}, {user?.name || 'User'} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {isAdmin
            ? "Here's an overview of your restaurant operations today."
            : "Here's a summary of your reservations."}
        </p>
      </div>

      {/* Stats grid */}
      {isAdmin ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-brand-orange/5 rounded-full -mr-6 -mt-6" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center">
                  <LayoutGrid className="w-5 h-5 text-brand-orange" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {totalTables}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Total Tables
              </p>
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-full -mr-6 -mt-6" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-green-500" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {availableTables}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Available
              </p>
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/5 rounded-full -mr-6 -mt-6" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {pendingCount}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Pending Reservations
              </p>
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full -mr-6 -mt-6" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {occupiedTables}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Occupied Now
              </p>
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-brand-orange/5 rounded-full -mr-6 -mt-6" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5 text-brand-orange" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {totalReservations}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Total Reservations
              </p>
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full -mr-6 -mt-6" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {upcomingReservations.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Upcoming
              </p>
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-full -mr-6 -mt-6" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5 text-green-500" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {confirmedCount}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Confirmed
              </p>
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/5 rounded-full -mr-6 -mt-6" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {pendingCount}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Pending
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            {isAdmin ? (
              <>
                <button
                  onClick={() => navigate('/admin/reservations')}
                  className="flex items-center justify-between w-full p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Review Pending Reservations
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {pendingCount} reservation{pendingCount !== 1 ? 's' : ''}{' '}
                        awaiting confirmation
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
                </button>
                <button
                  onClick={() => navigate('/admin/tables')}
                  className="flex items-center justify-between w-full p-3 rounded-xl bg-brand-orange/5 hover:bg-brand-orange/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <LayoutGrid className="w-5 h-5 text-brand-orange" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Manage Tables
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {maintenanceTables} table{maintenanceTables !== 1 ? 's' : ''}{' '}
                        in maintenance
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/tables')}
                  className="flex items-center justify-between w-full p-3 rounded-xl bg-brand-orange/5 hover:bg-brand-orange/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <UtensilsCrossed className="w-5 h-5 text-brand-orange" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Find &amp; Book a Table
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Search available tables for your next meal
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
                </button>
                <button
                  onClick={() => navigate('/my-reservations')}
                  className="flex items-center justify-between w-full p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <CalendarCheck className="w-5 h-5 text-blue-500" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        View My Reservations
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Check status of your bookings
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
                </button>
              </>
            )}
          </div>
        </Card>

        {/* Recent activity */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {isAdmin ? 'Recent Reservations' : 'Upcoming Reservations'}
          </h3>
          {(isAdmin ? reservations : upcomingReservations).length === 0 ? (
            <div className="text-center py-8">
              <CalendarCheck className="w-10 h-10 text-gray-200 dark:text-gray-700 mx-auto mb-2" />
              <p className="text-sm text-gray-400 dark:text-gray-500">
                No reservations to display
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {(isAdmin ? reservations : upcomingReservations)
                .slice(0, 4)
                .map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface-light dark:bg-surface-dark-deep"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Table {r.tableNumber || `#${r.tableId}`}
                        </p>
                        <StatusBadge status={r.status} size="xs" />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(r.reservationDate)} •{' '}
                        {formatTime(r.startTime)}
                        {isAdmin && r.userName ? ` • ${r.userName}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Users className="w-3.5 h-3.5" />
                      {r.guestCount}
                    </div>
                  </div>
                ))}
            </div>
          )}
          {(isAdmin ? reservations : upcomingReservations).length > 4 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                navigate(isAdmin ? '/admin/reservations' : '/my-reservations')
              }
              className="mt-3 w-full"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
