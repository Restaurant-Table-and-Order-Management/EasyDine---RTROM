import React, { useState } from 'react';
import { Search, Calendar, Clock, Users, UtensilsCrossed } from 'lucide-react';
import useDataStore from '../../store/dataStore';
import TableCard from './TableCard';
import BookingModal from '../reservations/BookingModal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getTodayDate } from '../../utils/dateHelpers';

export default function TableSearchPage() {
  const {
    searchResults,
    searchLoading,
    hasSearched,
    searchAvailableTables,
    selectTable,
    selectedTable,
    searchParams,
  } = useDataStore();

  const [date, setDate] = useState(searchParams.date || getTodayDate());
  const [time, setTime] = useState(searchParams.time || '19:00');
  const [capacity, setCapacity] = useState(searchParams.capacity || '2');
  const [errors, setErrors] = useState({});

  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!date) newErrors.date = 'Date is required';
    if (!time) newErrors.time = 'Time is required';
    if (!capacity || parseInt(capacity) < 1) newErrors.capacity = 'At least 1 guest';
    if (parseInt(capacity) > 20) newErrors.capacity = 'Maximum 20 guests';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const timeFormatted = time.length === 5 ? `${time}:00` : time;
    searchAvailableTables(date, timeFormatted, capacity);
  };

  const handleReserve = (table) => {
    selectTable(table);
    setBookingModalOpen(true);
  };

  const handleBookingClose = () => {
    setBookingModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Find Your Perfect Table
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Search available tables by date, time, and party size
        </p>
      </div>

      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6 mb-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            error={errors.date}
            min={getTodayDate()}
            icon={Calendar}
          />
          <Input
            label="Time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            error={errors.time}
            icon={Clock}
          />
          <Input
            label="Guests"
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            error={errors.capacity}
            min="1"
            max="20"
            placeholder="2"
            icon={Users}
          />
          <div className="flex items-end">
            <Button type="submit" fullWidth loading={searchLoading} size="lg">
              <Search className="w-4 h-4" />
              Search Tables
            </Button>
          </div>
        </div>
      </form>

      {/* Results */}
      {searchLoading && <LoadingSpinner text="Searching available tables..." />}

      {!searchLoading && hasSearched && searchResults.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-50 dark:bg-orange-900/10 flex items-center justify-center">
            <UtensilsCrossed className="w-10 h-10 text-brand-orange/50" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No tables available
          </h3>
          <p className="text-gray-400 dark:text-gray-500 max-w-sm mx-auto">
            No tables available for this slot. Try a different date, time, or party size.
          </p>
        </div>
      )}

      {!searchLoading && searchResults.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {searchResults.length}
              </span>{' '}
              table{searchResults.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                onReserve={handleReserve}
              />
            ))}
          </div>
        </>
      )}

      {!hasSearched && !searchLoading && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
            <Search className="w-10 h-10 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Search for tables
          </h3>
          <p className="text-gray-400 dark:text-gray-500 max-w-sm mx-auto">
            Use the search bar above to find available tables for your desired date and time.
          </p>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={handleBookingClose}
        table={selectedTable}
        prefillDate={date}
        prefillTime={time}
        prefillGuests={capacity}
      />
    </div>
  );
}
