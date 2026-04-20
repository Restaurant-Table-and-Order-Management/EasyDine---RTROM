import React from 'react';
import { Calendar, Clock, Users, MessageSquare, Hash } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { formatDate, formatTimeRange } from '../../utils/dateHelpers';

export default function ReservationCard({
  reservation,
  onCancel,
  onConfirm,
  showCustomerName = false,
  showActions = true,
}) {
  const canCancel =
    reservation.status === 'PENDING' || reservation.status === 'CONFIRMED';
  const canConfirm = reservation.status === 'PENDING';

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      onCancel && onCancel(reservation.id);
    }
  };

  return (
    <Card hover className="animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={reservation.status} />
            {showCustomerName && reservation.userName && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {reservation.userName}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Hash className="w-4 h-4 text-brand-orange flex-shrink-0" />
              <span>
                Table:{' '}
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  {reservation.tableNumber || `#${reservation.tableId}`}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4 text-brand-orange flex-shrink-0" />
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {formatDate(reservation.reservationDate)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4 text-brand-orange flex-shrink-0" />
              <span>
                {formatTimeRange(reservation.startTime, reservation.endTime)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Users className="w-4 h-4 text-brand-orange flex-shrink-0" />
              <span>
                {reservation.guestCount} guest
                {reservation.guestCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Special requests */}
          {reservation.specialRequests && (
            <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
              <MessageSquare className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" />
              <span className="italic">{reservation.specialRequests}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (canCancel || canConfirm) && (
          <div className="flex sm:flex-col gap-2 flex-shrink-0">
            {canConfirm && onConfirm && (
              <Button
                variant="success"
                size="sm"
                onClick={() => onConfirm(reservation.id)}
              >
                Confirm
              </Button>
            )}
            {canCancel && onCancel && (
              <Button variant="danger" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
