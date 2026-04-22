import React, { useState, useEffect, useRef } from 'react';
import { Clock, RefreshCcw, Bell, AlertCircle, LayoutGrid, Terminal } from 'lucide-react';
import useDataStore from '../../store/dataStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import KitchenTicket from '../../components/kitchen/KitchenTicket';

const POLL_INTERVAL = 5000; // 5 seconds

export default function KitchenDashboard() {
  const { 
    activeOrders, 
    ordersLoading, 
    fetchActiveOrders, 
    updateOrderStatus 
  } = useDataStore();
  
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [countdown, setCountdown] = useState(POLL_INTERVAL / 1000);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const audioRef = useRef(null);

  // sound notification logic
  const playNotification = () => {
    if (audioRef.current) {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  useEffect(() => {
    const doFetch = async () => {
        const result = await fetchActiveOrders();
        setLastRefreshed(new Date());
        setCountdown(POLL_INTERVAL / 1000);
        if (result?.hasNew) {
            playNotification();
        }
    };

    doFetch();

    const refreshInterval = setInterval(doFetch, POLL_INTERVAL);
    const countdownInterval = setInterval(() => {
        setCountdown(prev => (prev > 0 ? prev - 1 : POLL_INTERVAL / 1000));
    }, 1000);

    return () => {
        clearInterval(refreshInterval);
        clearInterval(countdownInterval);
    };
  }, [fetchActiveOrders]);

  const handleManualRefresh = async () => {
    await fetchActiveOrders();
    setLastRefreshed(new Date());
    setCountdown(POLL_INTERVAL / 1000);
  };

  const handleStatusUpdate = async (orderId, status, estimatedMinutes) => {
    const res = await updateOrderStatus(orderId, status, estimatedMinutes);
    if (res.success) {
        // Optional: play a success sound
    }
  };

  const filteredOrders = activeOrders.filter(order => {
    const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;
    const matchesTable = !searchTerm || (order.tableNumber && order.tableNumber.toString().includes(searchTerm));
    return matchesStatus && matchesTable;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50 p-4 sm:p-6 space-y-6">
        {/* Hidden Audio for Notifications */}
        <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" preload="auto" />

        {/* Header Ribbon */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-orange/10 rounded-xl">
                    <Terminal className="w-6 h-6 text-brand-orange" />
                </div>
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                        Kitchen Display System
                    </h1>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">LIVE CONNECTION</span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="flex flex-col items-end text-right mr-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Last Sync</span>
                    <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                        {lastRefreshed.toLocaleTimeString([], { hour12: false })}
                    </span>
                </div>

                <div 
                    onClick={handleManualRefresh}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-all active:scale-95"
                >
                    <RefreshCcw className={`w-4 h-4 ${countdown >= POLL_INTERVAL/1000 - 1 ? 'animate-spin' : ''}`} />
                    <span className="text-xs font-black uppercase">{countdown}s</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-400 hover:text-brand-orange cursor-help transition-colors">
                    <AlertCircle className="w-5 h-5" />
                </div>
            </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex bg-white dark:bg-surface-dark p-1 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm w-full sm:w-auto">
                {['ALL', 'PLACED', 'IN_KITCHEN'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-xs font-black uppercase tracking-tighter transition-all ${
                            filterStatus === status 
                            ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20' 
                            : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                    >
                        {status.replace('_', ' ')}
                    </button>
                ))}
            </div>

            <div className="relative w-full sm:w-64 group">
                <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-orange transition-colors" />
                <input 
                    type="text"
                    placeholder="Find Table..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                />
            </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Active Tickets</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{activeOrders.length}</p>
            </div>
            <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Placed</p>
                <p className="text-2xl font-black text-brand-orange">
                    {activeOrders.filter(o => o.status === 'PLACED').length}
                </p>
            </div>
            <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">In Kitchen</p>
                <p className="text-2xl font-black text-blue-500">
                    {activeOrders.filter(o => o.status === 'IN_KITCHEN').length}
                </p>
            </div>
            <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Avg Cook Time</p>
                <p className="text-2xl font-black text-green-500">12m</p>
            </div>
        </div>

        {/* Order Grid */}
        <div>
            {ordersLoading && activeOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-surface-dark rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-sm">Initializing Display...</p>
                </div>
            ) : activeOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-surface-dark rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-center">
                    <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-full mb-6">
                        <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Active Orders</h3>
                    <p className="text-gray-500 max-w-xs">The board is clean! When new orders arrive, they'll appear here automatically.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="animate-in fade-in zoom-in duration-300">
                            <KitchenTicket 
                                order={order} 
                                onUpdateStatus={handleStatusUpdate} 
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
}
