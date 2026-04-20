import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  MessageSquare,
  Hash,
} from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import useDataStore from '../../store/dataStore';
import toast from 'react-hot-toast';

export default function BookingModal({
  isOpen,
  onClose,
  table,
  prefillDate = '',
  prefillTime = '',
  prefillGuests = '',
}) {
  const navigate = useNavigate();
  const { createReservation, clearSelectedTable } = useDataStore();

  const [formData, setFormData] = useState({
    date: prefillDate,
    startTime: prefillTime,
    endTime: '',
    guestCount: prefillGuests,
    specialRequests: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Update form when props change
  React.useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        date: prefillDate || prev.date,
        startTime: prefillTime || prev.startTime,
        guestCount: prefillGuests || prev.guestCount,
      }));
    }
  }, [isOpen, prefillDate, prefillTime, prefillGuests]);

  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    } else if (formData.startTime && formData.endTime <= formData.startTime) {
      newErrors.endTime = 'End time must be after start time';
    }
    if (!formData.guestCount || parseInt(formData.guestCount) < 1) {
      newErrors.guestCount = 'At least 1 guest required';
    }
    if (table && parseInt(formData.guestCount) > table.capacity) {
      newErrors.guestCount = `Maximum ${table.capacity} guests for this table`;
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
    if (!validate() || !table) return;

    setLoading(true);
    const startFormatted =
      formData.startTime.length === 5
        ? `${formData.startTime}:00`
        : formData.startTime;
    const endFormatted =
      formData.endTime.length === 5
        ? `${formData.endTime}:00`
        : formData.endTime;

    const result = await createReservation({
      tableId: table.id,
      reservationDate: formData.date,
      startTime: startFormatted,
      endTime: endFormatted,
      guestCount: parseInt(formData.guestCount),
      specialRequests: formData.specialRequests || '',
    });
    setLoading(false);

    if (result.success) {
      toast.success('Reservation created successfully!');
      clearSelectedTable();
      onClose();
      navigate('/my-reservations');
    } else {
      toast.error(result.message);
    }
  };

  if (!table) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book a Table" size="md">
      {/* Table info */}
      <div className="bg-surface-light dark:bg-surface-dark-deep rounded-xl p-4 mb-5 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Hash className="w-4 h-4 text-brand-orange" />
          <span className="font-semibold text-gray-900 dark:text-white">
            Table {table.tableNumber}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Users className="w-4 h-4 text-brand-orange" />
          <span>Up to {table.capacity} guests</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="w-4 h-4 text-brand-orange" />
          <span>
            {table.location} • Floor {table.floorNumber}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
          icon={Calendar}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Time"
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            error={errors.startTime}
            icon={Clock}
          />
          <Input
            label="End Time"
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            error={errors.endTime}
            icon={Clock}
          />
        </div>

        <Input
          label="Number of Guests"
          type="number"
          name="guestCount"
          min="1"
          max={table.capacity}
          value={formData.guestCount}
          onChange={handleChange}
          error={errors.guestCount}
          icon={Users}
          helperText={`Max ${table.capacity} for this table`}
        />

        <Input
          label="Special Requests"
          type="textarea"
          name="specialRequests"
          placeholder="Any dietary requirements, celebrations, seating preferences..."
          value={formData.specialRequests}
          onChange={handleChange}
          icon={MessageSquare}
        />

        <div className="flex gap-3 pt-2">
          <Button
            variant="secondary"
            onClick={onClose}
            type="button"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            Confirm Booking
          </Button>
        </div>
      </form>
    </Modal>
  );
}
