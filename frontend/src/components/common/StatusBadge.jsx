import React from 'react';
import { STATUS_COLORS } from '../../utils/constants';

export default function StatusBadge({ status, size = 'sm' }) {
  const colorClasses = STATUS_COLORS[status] || 'bg-gray-100 text-gray-600 border-gray-200';

  const sizes = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${colorClasses} ${sizes[size]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse-soft" />
      {status}
    </span>
  );
}
