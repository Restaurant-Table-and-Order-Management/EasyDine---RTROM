import React, { useEffect } from 'react';
import { CalendarX } from 'lucide-react';
import useDataStore from '../../store/dataStore';
import ReservationCard from './ReservationCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function MyReservationsPage() {
  const {
    reservations,
    reservationsLoading,
    fetchMyReservations,
    cancelReservation,
  } = useDataStore();

  useEffect(() => {
    fetchMyReservations();
  }, [fetchMyReservations]);

  const handleCancel = async (id) => {
    const result = await cancelReservation(id);
    if (result.success) {
      toast.success('Reservation cancelled successfully');
    } else {
      toast.error(result.message);
    }
  };

  // Sort by date descending (upcoming first)
  const sortedReservations = [...reservations].sort((a, b) => {
    const dateA = `${a.reservationDate}T${a.startTime}`;
    const dateB = `${b.reservationDate}T${b.startTime}`;
    return dateB > dateA ? -1 : dateB < dateA ? 1 : 0;
  });

  if (reservationsLoading) {
    return <LoadingSpinner size="lg" text="Loading your reservations..." />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          My Reservations
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          View and manage your upcoming and past reservations
        </p>
      </div>

      {sortedReservations.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
            <CalendarX className="w-10 h-10 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No reservations yet
          </h3>
          <p className="text-gray-400 dark:text-gray-500 max-w-sm mx-auto">
            Book a table to see your reservations here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
