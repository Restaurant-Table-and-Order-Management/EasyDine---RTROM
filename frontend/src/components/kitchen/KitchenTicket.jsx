import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Flame, AlertTriangle, User, Hash, XCircle, ChefHat, Utensils } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import useDataStore from '../../store/dataStore';
import toast from 'react-hot-toast';

const ESTIMATE_OPTIONS = [10, 15, 20, 30];

export default function KitchenTicket({ order, onUpdateStatus }) {
  const { cancelOrder } = useDataStore();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showEstimates, setShowEstimates] = useState(false);

  useEffect(() => {
    const calculateElapsed = () => {
      const created = new Date(order.createdAt);
      const now = new Date();
      const diffMs = now - created;
      setElapsedTime(Math.floor(diffMs / (1000 * 60))); // minutes
    };

    calculateElapsed();
    const timer = setInterval(calculateElapsed, 30000); // update every 30s
    return () => clearInterval(timer);
  }, [order.createdAt]);

  const getPriorityColor = () => {
    if (elapsedTime >= 20) return 'border-red-500 shadow-lg shadow-red-500/20 animate-pulse-slow';
    if (elapsedTime >= 10) return 'border-yellow-500 shadow-md shadow-yellow-500/10';
    return 'border-gray-200 dark:border-gray-700';
  };

  const getTimeStatusClass = () => {
    if (elapsedTime >= 20) return 'text-red-600 dark:text-red-400 font-bold';
    if (elapsedTime >= 10) return 'text-yellow-600 dark:text-yellow-400 font-bold';
    return 'text-gray-500 dark:text-gray-400';
  };

  const handleStatusClick = async (manualEstimate = null) => {
    setIsUpdating(true);
    let nextStatus;
    if (order.status === 'PLACED') nextStatus = 'IN_KITCHEN';
    else if (order.status === 'IN_KITCHEN') nextStatus = 'READY';
    else nextStatus = 'SERVED';
    
    if (order.status === 'PLACED' && !showEstimates && manualEstimate === null) {
      setShowEstimates(true);
      setIsUpdating(false);
      return;
    }

    await onUpdateStatus(order.id, nextStatus, manualEstimate);
    setShowEstimates(false);
    setIsUpdating(false);
  };

  const handleCancelClick = async () => {
    const reason = window.prompt('Enter reason for cancellation:');
    if (reason === null) return; // User cancelled the prompt
    
    if (!reason.trim()) {
        toast.error('Reason is required for cancellation');
        return;
    }

    setIsUpdating(true);
    const res = await cancelOrder(order.id, reason);
    if (res.success) {
        toast.success('Order cancelled');
    } else {
        toast.error(res.message);
    }
    setIsUpdating(false);
  };

  return (
    <Card className={`flex flex-col h-full border-t-8 transition-all duration-500 ${getPriorityColor()} p-0 overflow-hidden`}>
      {/* Header */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 text-brand-orange mb-1">
            <Hash className="w-4 h-4" />
            <span className="text-lg font-bold">Order #{order.id}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
            <User className="w-3.5 h-3.5" />
            <span className="font-medium">{order.customerName}</span>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-gray-900 border ${getPriorityColor()} shadow-sm`}>
           <Clock className={`w-3.5 h-3.5 ${getTimeStatusClass()}`} />
           <span className={`text-sm ${getTimeStatusClass()}`}>{elapsedTime}m</span>
        </div>
      </div>

      {/* Table Badge */}
      <div className="px-4 py-2 bg-brand-orange/10 flex justify-between items-center">
        <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">Table</span>
        <span className="text-sm font-black text-brand-orange">T-{order.tableNumber || order.tableId}</span>
      </div>

      {/* Items List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[150px]">
        {order.items.map((item, idx) => (
          <div key={idx} className="group">
            <div className="flex justify-between items-start gap-2">
              <div className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-gray-100 dark:bg-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300">
                  {item.quantity}x
                </span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{item.menuItemName}</span>
              </div>
            </div>
            {item.specialInstructions && (
              <div className="ml-9 mt-1.5 p-3 bg-brand-orange/10 border-l-4 border-brand-orange rounded-r-lg animate-pulse-slow">
                <div className="flex items-center gap-1.5 mb-1">
                   <AlertTriangle className="w-3 h-3 text-brand-orange fill-brand-orange/20" />
                   <span className="text-[10px] font-black text-brand-orange uppercase">Special Instruction</span>
                </div>
                <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
                  {item.specialInstructions}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer / Actions */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700/50 flex flex-col gap-2">
        {showEstimates && (
            <div className="flex flex-wrap gap-1 mb-2 animate-in slide-in-from-top-2 duration-300">
                <p className="w-full text-[10px] font-bold text-gray-400 uppercase mb-1 px-1">Minutes Prep:</p>
                {ESTIMATE_OPTIONS.map(mins => (
                    <button
                        key={mins}
                        onClick={() => handleStatusClick(mins)}
                        className="flex-1 py-1 px-2 text-xs font-black bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-orange hover:text-brand-orange transition-colors"
                    >
                        {mins}m
                    </button>
                ))}
                <button
                    onClick={() => handleStatusClick()}
                    className="flex-1 py-1 px-2 text-xs font-black bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-500"
                >
                    Auto
                </button>
            </div>
        )}

        <div className="flex gap-2 w-full">
            <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 px-2"
                onClick={handleCancelClick}
                disabled={isUpdating}
            >
                <XCircle className="w-4 h-4" />
            </Button>

            <Button
              variant={order.status === 'PLACED' ? 'primary' : order.status === 'IN_KITCHEN' ? 'success' : 'outline'}
              className={`flex-1 shadow-md ${order.status === 'READY' ? 'border-green-500 text-green-600 hover:bg-green-50' : ''}`}
              onClick={() => handleStatusClick()}
              loading={isUpdating}
            >
              {order.status === 'PLACED' ? (
                <>
                  <ChefHat className="w-4 h-4 mr-2" />
                  {showEstimates ? 'Starting...' : 'Start Prep'}
                </>
              ) : order.status === 'PREPARING' ? (
                <>
                  <Flame className="w-4 h-4 mr-2 text-orange-400" />
                  Start Cook
                </>
              ) : order.status === 'COOKING' ? (
                <>
                  <Utensils className="w-4 h-4 mr-2 text-pink-400" />
                  Start Plating
                </>
              ) : order.status === 'PLATING' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Ready
                </>
              ) : order.status === 'IN_KITCHEN' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Served
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Serve Now
                </>
              )}
            </Button>
        </div>
      </div>
    </Card>
  );
}
