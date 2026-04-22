import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, RefreshCcw, Bell, CheckCircle2, Navigation, Coffee, Clock } from 'lucide-react';
import useDataStore from '../../store/dataStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import WaiterTicket from '../../components/waiter/WaiterTicket';
import BillModal from '../../components/billing/BillModal';
import toast from 'react-hot-toast';

const POLL_INTERVAL = 15000;

export default function WaiterDashboard() {
  const { 
    readyOrders: activeOrders, 
    ordersLoading, 
    fetchReadyOrders, 
    updateOrderStatus,
    fetchBill
  } = useDataStore();
  
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [countdown, setCountdown] = useState(POLL_INTERVAL / 1000);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isBillingLoading, setIsBillingLoading] = useState(false);
  const audioRef = useRef(null);

  const playNotification = () => {
    if (audioRef.current) {
        audioRef.current.play().catch(e => console.log('Audio failed:', e));
    }
  };

  useEffect(() => {
    const doFetch = async () => {
        const res = await fetchReadyOrders();
        setLastRefreshed(new Date());
        setCountdown(POLL_INTERVAL / 1000);
        if (res?.hasNew) {
            playNotification();
            toast('New order ready!', { icon: '🔔', position: 'bottom-center' });
        }
    };

    doFetch();
    const interval = setInterval(doFetch, POLL_INTERVAL);
    const countTimer = setInterval(() => {
        setCountdown(prev => (prev > 0 ? prev - 1 : POLL_INTERVAL / 1000));
    }, 1000);

    return () => {
        clearInterval(interval);
        clearInterval(countTimer);
    };
  }, [fetchReadyOrders]);

  const handleManualRefresh = async () => {
    await fetchReadyOrders();
    setLastRefreshed(new Date());
    setCountdown(POLL_INTERVAL / 1000);
    toast.success('Orders updated');
  };

  const handleMarkServed = async (orderId) => {
    const res = await updateOrderStatus(orderId, 'SERVED');
    if (res.success) toast.success('Order Served');
  };

  const handleReviewBill = async (reservationId) => {
    setIsBillingLoading(true);
    const res = await fetchBill(reservationId);
    if (res.success) {
        setSelectedBill(res.data);
    } else {
        toast.error(res.message);
    }
    setIsBillingLoading(false);
  };

  const handleConfirmPayment = async () => {
    const res = await confirmPayment(selectedBill.reservationId);
    if (res.success) {
        toast.success('Payment settled and session closed!');
        setSelectedBill(null);
        fetchReadyOrders();
    } else {
        toast.error(res.message);
    }
    return res;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50 p-4 sm:p-6 space-y-6">
        {/* Hidden Audio */}
        <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" preload="auto" />

        {/* Header */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-xl">
                    <Navigation className="w-6 h-6 text-green-600" />
                </div>
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                        Service Dashboard
                    </h1>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">WAITING FOR DELIVERY</span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <div 
                    onClick={handleManualRefresh}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-all active:scale-95"
                >
                    <RefreshCcw className={`w-4 h-4 ${countdown >= POLL_INTERVAL/1000 - 1 ? 'animate-spin' : ''}`} />
                    <span className="text-xs font-black uppercase">{countdown}s</span>
                </div>
            </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Ready for Pickup</p>
                    <p className="text-3xl font-black text-green-600">{activeOrders.length}</p>
                </div>
                <ShoppingBag className="w-10 h-10 text-green-500/20" />
            </div>
            <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Avg Service Time</p>
                    <p className="text-3xl font-black text-blue-500">4m</p>
                </div>
                <Clock className="w-10 h-10 text-blue-500/20" />
            </div>
            <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Status</p>
                    <p className="text-sm font-bold text-green-500 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> System Online
                    </p>
                </div>
                <RefreshCcw className="w-10 h-10 text-gray-500/10" />
            </div>
        </div>

        {/* Grid */}
        <div className="mt-8">
            {ordersLoading && activeOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <LoadingSpinner size="lg" />
                </div>
            ) : activeOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-surface-dark rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-center">
                    <div className="p-6 bg-green-50 dark:bg-green-900/10 rounded-full mb-6">
                        <Coffee className="w-12 h-12 text-green-300 dark:text-green-800" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Queue is Clear</h3>
                    <p className="text-gray-500 max-w-xs">No orders are waiting to be served. Take a break!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activeOrders.map(order => (
                        <WaiterTicket 
                            key={order.id} 
                            order={order} 
                            onMarkServed={handleMarkServed} 
                            onReviewBill={handleReviewBill}
                        />
                    ))}
                </div>
            )}
        </div>

        {selectedBill && (
            <BillModal 
                bill={selectedBill} 
                onClose={() => setSelectedBill(null)}
                onConfirmPayment={handleConfirmPayment}
            />
        )}
    </div>
  );
}
