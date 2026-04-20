import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  MapPin, 
  ChevronLeft, 
  Utensils, 
  CheckCircle2, 
  AlertCircle,
  ShoppingBag,
  MoreVertical,
  Timer,
  ChefHat
} from 'lucide-react';
import useDataStore from '../../store/dataStore';
import useCartStore from '../../store/cartStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ReorderButton from './ReorderButton';
import api from '../../api/axiosConfig';
import { formatTime } from '../../utils/dateHelpers';

export default function OrderTrackingPage() {
  const { id: reservationId } = useParams();
  const navigate = useNavigate();
  const { setActiveReservationId } = useCartStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState(null);

  const fetchSessionData = async () => {
    try {
      const reservationRes = await api.get(`/reservations/${reservationId}`);
      setReservation(reservationRes.data || reservationRes);
      
      const ordersRes = await api.get(`/orders/reservation/${reservationId}`);
      setOrders(ordersRes.data || (Array.isArray(ordersRes) ? ordersRes : []));
      
      // Ensure the cart knows this is our active session
      setActiveReservationId(reservationId);
    } catch (error) {
      console.error('Failed to fetch session data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionData();
    // Poll for status updates every 15 seconds
    const interval = setInterval(fetchSessionData, 15000);
    return () => clearInterval(interval);
  }, [reservationId]);

  const getStatusStep = (status) => {
    const steps = {
      'PENDING': 1,
      'PREPARING': 2,
      'READY': 3,
      'SERVED': 4,
      'CANCELLED': 0
    };
    return steps[status] || 0;
  };

  if (loading) return <LoadingSpinner size="lg" text="Syncing with the kitchen..." />;

  if (!reservation) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Session Not Found</h2>
        <p className="text-gray-500 mt-2">We couldn't find the dining session you're looking for.</p>
        <Button onClick={() => navigate('/dashboard')} className="mt-8">Go to Dashboard</Button>
      </div>
    );
  }

  const totalSessionAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Live Dining Session</h1>
          <p className="text-sm text-gray-500">Table {reservation.tableNumber} • {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Orders List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your Submissions</h3>
            <Button size="sm" onClick={() => navigate('/menu')}>
              <ShoppingBag className="w-4 h-4 mr-2" /> Add More
            </Button>
          </div>

          {orders.length === 0 ? (
            <Card className="p-12 text-center bg-gray-50/50 dark:bg-gray-800/10 border-dashed">
                <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">No orders placed yet for this visit.</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/menu')}>Browse Menu</Button>
            </Card>
          ) : (
            orders.map((order, idx) => (
              <Card key={order.id} className="overflow-hidden border-l-4 border-l-brand-orange">
                <div className="p-5 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/30 dark:bg-gray-800/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-surface-dark flex items-center justify-center text-brand-orange shadow-sm">
                      #{orders.length - idx}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Order ID</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white">ED-{order.id.toString().padStart(5, '0')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ReorderButton order={order} size="sm" variant="ghost" className="text-xs" />
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                <div className="p-6">
                  {/* Status Progress Bar */}
                  {order.status !== 'CANCELLED' && (
                    <div className="mb-8 relative">
                      <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-100 dark:bg-gray-800 -z-10" />
                      <div className="flex justify-between items-center">
                        {[
                          { label: 'Pending', icon: Timer },
                          { label: 'Preparing', icon: ChefHat },
                          { label: 'Ready', icon: ShoppingBag },
                          { label: 'Served', icon: CheckCircle2 }
                        ].map((step, i) => {
                          const stepId = i + 1;
                          const currentStep = getStatusStep(order.status);
                          const isCompleted = currentStep >= stepId;
                          const isActive = currentStep === stepId;
                          
                          return (
                            <div key={step.label} className="flex flex-col items-center gap-2">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${
                                isCompleted ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20 scale-110' : 'bg-white dark:bg-surface-dark text-gray-300 border border-gray-100 dark:border-gray-800'
                              }`}>
                                <step.icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                              </div>
                              <span className={`text-[10px] font-bold uppercase tracking-widest ${isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Items List */}
                  <div className="space-y-3">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="font-black text-brand-orange">×{item.quantity}</span>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{item.menuItemName}</p>
                            {item.specialInstructions && (
                              <p className="text-xs text-gray-500 italic">"{item.specialInstructions}"</p>
                            )}
                          </div>
                        </div>
                        <span className="font-medium text-gray-500">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Total</span>
                      <span className="text-lg font-black text-gray-900 dark:text-white">${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Sidebar: Session Stats */}
        <div className="space-y-6">
          <Card className="p-0 bg-gradient-to-br from-brand-orange to-brand-gold text-white overflow-hidden border-none shadow-xl shadow-brand-orange/20">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold opacity-80 uppercase tracking-widest">Running Total</h4>
                  <p className="text-3xl font-black">${totalSessionAmount.toFixed(2)}</p>
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-white/20">
                <div className="flex justify-between items-center text-sm">
                    <span className="opacity-80">Total Orders</span>
                    <span className="font-bold">{orders.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="opacity-80">Payment Status</span>
                    <span className="bg-white/20 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase">Unpaid</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-orange" /> Location Details
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Table Number</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">#{reservation.tableNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Floor</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">Garden Area</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Party Size</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{reservation.guestCount} Guests</span>
              </div>
            </div>
            <Button variant="outline" fullWidth className="mt-6 border-red-100 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
              Request Assistance
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
