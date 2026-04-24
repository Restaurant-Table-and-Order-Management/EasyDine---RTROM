import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import useDataStore from '../../store/dataStore';
import useCartStore from '../../store/cartStore';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function StripeSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyStripePayment } = useDataStore();
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  const sessionId = searchParams.get('session_id');
  const reservationId = searchParams.get('reservation_id');

  useEffect(() => {
    const verify = async () => {
      if (!sessionId || !reservationId) {
        setStatus('error');
        return;
      }

      try {
        const result = await verifyStripePayment(sessionId, reservationId);
        if (result.success) {
          
          if (reservationId === '0') {
              const { items, clearCart, activeReservationId } = useCartStore.getState();
              if (items.length > 0) {
                  try {
                      const orderData = {
                          items: items.map((item) => ({
                              menuItemId: item.id,
                              quantity: item.quantity,
                              specialInstructions: item.specialInstructions,
                          })),
                          reservationId: activeReservationId,
                          paymentMethod: 'STRIPE'
                      };
                      const api = (await import('../../api/axiosConfig')).default;
                      await api.post('/orders', orderData);
                      clearCart();
                  } catch (e) {
                      console.error("Failed to create order post-payment", e);
                  }
              }
          }

          setStatus('success');
          toast.success('Payment verified successfully!');
        } else {
          setStatus('error');
          toast.error(result.message || 'Payment verification failed');
        }
      } catch (error) {
        setStatus('error');
        toast.error('Failed to verify payment');
      }
    };

    verify();
  }, [sessionId, reservationId, verifyStripePayment]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-fade-in">
      <div className="max-w-md w-full text-center">
        {status === 'verifying' && (
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto bg-brand-orange/10 rounded-full flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-brand-orange animate-spin" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Verifying Payment</h2>
              <p className="text-gray-500">Please wait while we confirm your payment with Stripe...</p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center animate-bounce-slow">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Payment Successful!</h2>
              <p className="text-gray-500 mb-2">
                {reservationId === '0' 
                  ? 'Your online order has been placed and paid via Stripe.' 
                  : 'Your dining session has been completed and paid via Stripe.'}
              </p>
              <p className="text-sm text-gray-400">Session ID: <span className="font-mono text-xs">{sessionId?.slice(0, 20)}...</span></p>
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <Button 
                onClick={() => navigate(reservationId === '0' ? '/my-orders' : `/order-tracking/${reservationId}`)}
                className="bg-gradient-to-r from-brand-orange to-brand-gold shadow-lg shadow-brand-orange/20"
              >
                {reservationId === '0' ? 'View My Orders' : 'View Session Details'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Verification Failed</h2>
              <p className="text-gray-500">We couldn't verify your payment. Please contact support if you were charged.</p>
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <Button 
                onClick={() => navigate((reservationId && reservationId !== '0') ? `/order-tracking/${reservationId}` : '/my-orders')}
                className="bg-gradient-to-r from-brand-orange to-brand-gold"
              >
                {reservationId === '0' ? 'Go to My Orders' : 'Return to Session'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
