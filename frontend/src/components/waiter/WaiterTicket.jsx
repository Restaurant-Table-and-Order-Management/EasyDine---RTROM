import React, { useState } from 'react';
import { CheckCircle, User, Hash, MapPin, Navigation, Receipt } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function WaiterTicket({ order, onMarkServed }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleServedClick = async () => {
    setIsUpdating(true);
    await onMarkServed(order.id, 'SERVED');
    setIsUpdating(false);
  };

  return (
    <Card className="flex flex-col h-full border-t-8 border-green-500 p-0 overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="p-4 bg-green-50/50 dark:bg-green-900/10 border-b border-green-100 dark:border-green-900/20 flex justify-between items-center">
        <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
          <Hash className="w-4 h-4" />
          <span className="text-lg font-bold">#{order.id}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-gray-900 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-xs font-black uppercase tracking-wider">
           Ready for Service
        </div>
      </div>

      {/* Table & Location */}
      <div className="p-4 flex items-center justify-between bg-white dark:bg-gray-800/50">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-orange text-white flex items-center justify-center font-black text-lg">
                {order.tableNumber || `T${order.tableId}`}
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase leading-none mb-1">Destination</p>
                <div className="flex items-center gap-1 text-sm font-bold text-gray-700 dark:text-gray-200">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>Table {order.tableNumber || order.tableId}</span>
                </div>
            </div>
        </div>
        <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase leading-none mb-1">Customer</p>
            <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{order.customerName}</p>
        </div>
      </div>

      {/* Items Summary */}
      <div className="flex-1 p-4 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="space-y-2">
            {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="font-black text-brand-orange">{item.quantity}x</span>
                    <span className="text-gray-600 dark:text-gray-400 font-medium line-clamp-1">{item.menuItemName}</span>
                </div>
            ))}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-white dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700/50 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="px-3"
          onClick={() => onReviewBill(order.reservationId)}
          disabled={isUpdating}
        >
          <Receipt className="w-4 h-4" />
        </Button>
        <Button
          variant="success"
          className="flex-1 shadow-lg"
          onClick={handleServedClick}
          loading={isUpdating}
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Served
        </Button>
      </div>
    </Card>
  );
}
