import React from 'react';
import { MapPin, Users, Layers, ArrowRight } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/ui/Button';
import { TABLE_IMAGES } from '../../utils/constants';

export default function TableCard({ table, onReserve, showActions = true }) {
  const imageIndex = (table.id || 0) % TABLE_IMAGES.length;
  const imageUrl = TABLE_IMAGES[imageIndex];

  return (
    <div className="group bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={imageUrl}
          alt={`Table ${table.tableNumber}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 right-3">
          <StatusBadge status={table.status} size="xs" />
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 rounded-lg bg-white/90 dark:bg-surface-dark/90 backdrop-blur-sm text-sm font-bold text-gray-900 dark:text-white">
            {table.tableNumber}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Users className="w-4 h-4 text-brand-orange" />
            <span>Capacity: <span className="font-semibold text-gray-700 dark:text-gray-200">{table.capacity} guests</span></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="w-4 h-4 text-brand-orange" />
            <span>{table.location || 'Indoor'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Layers className="w-4 h-4 text-brand-orange" />
            <span>Floor {table.floorNumber || 1}</span>
          </div>
        </div>

        {showActions && table.status === 'AVAILABLE' && (
          <Button
            onClick={() => onReserve && onReserve(table)}
            fullWidth
            size="sm"
          >
            Reserve
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        )}

        {showActions && table.status !== 'AVAILABLE' && (
          <div className="text-center py-2 text-sm text-gray-400 dark:text-gray-500">
            Currently unavailable
          </div>
        )}
      </div>
    </div>
  );
}
