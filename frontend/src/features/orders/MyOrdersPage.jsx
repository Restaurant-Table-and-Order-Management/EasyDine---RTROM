import React, { useEffect } from 'react';
import { ShoppingBag, Clock, ChevronRight, UtensilsCrossed, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useDataStore from '../../store/dataStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/dateHelpers';

export default function MyOrdersPage() {
  const { myOrders, myOrdersLoading, fetchMyOrders } = useDataStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  const activeOrders = myOrders.filter(o => 
    o.status === 'PLACED' || o.status === 'IN_KITCHEN' || o.status === 'READY'
  );

  const pastOrders = myOrders.filter(o => 
    o.status === 'SERVED' || o.status === 'CANCELLED'
  );

  if (myOrdersLoading && myOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <LoadingSpinner size="lg" text="Loading your orders..." />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
            My Orders
          </h1>
          <p className="text-gray-500 font-medium">Track your delicious meals and review your history</p>
        </div>
        <Button onClick={() => navigate('/menu')} className="bg-brand-orange hover:bg-brand-orange-dark">
          Order New Items
        </Button>
      </div>

      {/* Active Orders Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-5 h-5 text-brand-orange" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Sessions</h2>
          <span className="bg-brand-orange/10 text-brand-orange text-xs px-2 py-0.5 rounded-full font-black">
            {activeOrders.length}
          </span>
        </div>

        {activeOrders.length === 0 ? (
          <Card className="p-12 text-center border-dashed bg-gray-50/50 dark:bg-gray-800/10">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No active orders right now.</p>
            <p className="text-sm text-gray-400 mt-1">Start ordering from the menu during your visit!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeOrders.map(order => (
              <Card key={order.id} className="p-6 border-l-4 border-l-brand-orange group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order #{order.id}</p>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {order.tableNumber ? `Table #${order.tableNumber}` : 'Dining Session'}
                      </h3>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-brand-orange">₹{(order.totalAmount || 0).toFixed(2)}</p>
                    {order.estimatedMinutes && order.status !== 'READY' && (
                        <p className="text-[10px] font-bold text-gray-400 flex items-center justify-end gap-1 mt-1">
                            <Clock className="w-3 h-3" /> {order.estimatedMinutes}m Prep Time
                        </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {order.items?.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        <span className="font-bold text-gray-900 dark:text-white">{item.quantity}x</span> {item.menuItemName}
                      </span>
                      <span className="font-medium text-gray-500">₹{item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Button 
                    className="w-full bg-gray-900 dark:bg-gray-800 hover:bg-black dark:hover:bg-gray-700"
                    onClick={() => navigate(`/order-track/${order.reservationId}`)}
                >
                    View Live Tracker <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* History Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order History</h2>
        </div>

        {pastOrders.length === 0 ? (
          <p className="text-sm text-gray-500 italic px-4">Your past orders will appear here once they are served.</p>
        ) : (
          <div className="space-y-3">
            {pastOrders.map(order => (
              <Card key={order.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>
                    {order.status === 'CANCELLED' ? <XCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900 dark:text-white">Order #{order.id}</p>
                        <span className="text-[10px] text-gray-400 font-medium">{formatDate(order.createdAt)}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                        {order.items?.length || 0} items • {order.status}
                        {order.cancellationReason && <span className="text-red-400 ml-2 italic">({order.cancellationReason})</span>}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                    <p className="font-black text-gray-900 dark:text-white">₹{(order.totalAmount || 0).toFixed(2)}</p>
                    <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => navigate(`/order-track/${order.reservationId}`)}>Details</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
