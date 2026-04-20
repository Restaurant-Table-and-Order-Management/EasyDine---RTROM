import React, { useState, useEffect } from 'react';
import { Clock, RefreshCcw, Bell } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useDataStore from '../../store/dataStore';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatTime, getTodayDate } from '../../utils/dateHelpers';

export default function KitchenDashboard() {
  const { user } = useAuthStore();
  const { tables, fetchTables, reservations, fetchAllReservations, tablesLoading } = useDataStore();
  
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [countdown, setCountdown] = useState(30);

  // Auto-refresh logic
  useEffect(() => {
    fetchTables();
    fetchAllReservations('', 'CONFIRMED'); // Only care about confirmed

    // 30s manual polling loop
    const refreshInterval = setInterval(() => {
        fetchTables();
        fetchAllReservations('', 'CONFIRMED');
        setLastRefreshed(new Date());
        setCountdown(30);
    }, 30000);

    const countdownInterval = setInterval(() => {
        setCountdown(prev => (prev > 0 ? prev - 1 : 30));
    }, 1000);

    return () => {
        clearInterval(refreshInterval);
        clearInterval(countdownInterval);
    };
  }, [fetchTables, fetchAllReservations]);

  const todayStr = getTodayDate();
  
  // Filter and sort today's confirmed reservations
  const todaysOrders = reservations
      .filter(r => r.reservationDate === todayStr && (r.status === 'CONFIRMED' || r.status === 'OCCUPIED' || r.status === 'PENDING')) 
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

  if (tablesLoading && tables.length === 0) {
    return <div className="p-10 flex justify-center"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header Ribbon */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
               <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                   Kitchen Dashboard
                   <span className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                       {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                   </span>
               </h1>
            </div>
            
            <div className="flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    Updated {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800 transition-all">
                    <RefreshCcw className={`w-4 h-4 ${countdown > 28 ? 'animate-spin' : ''}`} />
                    <span>Live (Refresh in {countdown}s)</span>
                </div>
            </div>
        </div>

        {/* Live Floor Status Board */}
        <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                Live Floor Status
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {tables.map(table => {
                    const isOccupied = table.status === 'OCCUPIED';
                    const isReserved = table.status === 'RESERVED';
                    const isMaint = table.status === 'MAINTENANCE';
                    
                    const bgClass = isOccupied ? 'bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/50' 
                                : isReserved ? 'bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50'
                                : isMaint ? 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800/50'
                                : 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30';
                    
                    const textClass = isOccupied ? 'text-orange-900 dark:text-orange-300'
                                    : isReserved ? 'text-blue-900 dark:text-blue-300'
                                    : isMaint ? 'text-red-900 dark:text-red-300'
                                    : 'text-green-900 dark:text-green-400';

                    return (
                        <div key={table.id} className={`p-3 rounded-xl border flex flex-col items-center justify-center aspect-square shadow-sm ${bgClass}`}>
                            <span className={`text-2xl font-bold ${textClass}`}>{table.tableNumber}</span>
                            <span className={`text-[10px] font-semibold uppercase mt-1 ${textClass}`}>
                                {table.status}
                            </span>
                            <span className="text-xs text-gray-500 mt-2">{table.capacity}p</span>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Today's Schedule */}
        <div>
           <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 mt-8 flex items-center gap-2">
               Today's Confirmed Bookings ({todaysOrders.length})
           </h2>
           
           <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
               {todaysOrders.length === 0 ? (
                   <div className="p-10 text-center text-gray-500">
                       No bookings confirmed for today yet.
                   </div>
               ) : (
                   <div className="divide-y divide-gray-100 dark:divide-gray-800">
                       {todaysOrders.map((r, i) => {
                           // Very simple "current time" logic for highlighting
                           const nowTime = new Date().toTimeString().substring(0,5);
                           const isNext = r.startTime >= nowTime && i < 3; // roughly "upcoming soon"
                           
                           return (
                               <div key={r.id} className={`p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${isNext ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                   <div className="flex-shrink-0 w-32 border-l-4 border-brand-orange pl-3">
                                       <p className="text-xl font-bold text-gray-900 dark:text-white">{formatTime(r.startTime)}</p>
                                       <p className="text-xs text-gray-500">till {formatTime(r.endTime)}</p>
                                   </div>
                                   
                                   <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
                                       <div>
                                           <p className="text-xs text-gray-500 mb-1">Table</p>
                                           <p className="text-lg font-bold text-brand-orange">T-{r.tableNumber || r.tableId}</p>
                                       </div>
                                       <div>
                                           <p className="text-xs text-gray-500 mb-1">Guests</p>
                                           <p className="font-semibold">{r.guestCount} pax</p>
                                       </div>
                                       <div className="col-span-2">
                                           <p className="text-xs text-gray-500 mb-1">Customer</p>
                                           <p className="font-semibold truncate">{r.userName || 'Guest Walk-in'}</p>
                                       </div>
                                   </div>

                                   {r.specialRequests && (
                                       <div className="w-full sm:w-auto mt-2 sm:mt-0 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-lg flex items-start gap-2 max-w-xs">
                                           <Bell className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                                           <p className="text-xs font-medium text-yellow-800 dark:text-yellow-400 italic">
                                               "{r.specialRequests}"
                                           </p>
                                       </div>
                                   )}
                                   
                                   <div className="flex-shrink-0">
                                       <StatusBadge status={r.status} />
                                   </div>
                               </div>
                           );
                       })}
                   </div>
               )}
           </div>
        </div>

    </div>
  );
}
