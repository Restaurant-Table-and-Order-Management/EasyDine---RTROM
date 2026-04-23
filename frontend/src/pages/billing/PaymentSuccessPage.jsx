import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight, Download } from 'lucide-react';
import useDataStore from '../../store/dataStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { confirmPayment } = useDataStore();
  const [verifying, setVerifying] = useState(true);

  const reservationId = searchParams.get('reservation_id');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const finalizePayment = async () => {
      if (!reservationId) {
        setVerifying(false);
        return;
      }

      try {
        // We call our confirmPayment logic to mark the session as COMPLETED in our DB
        // and save the permanent bill record with 'STRIPE' as the method.
        const res = await confirmPayment(reservationId, 'STRIPE');
        if (res.success) {
          toast.success('Payment Verified & Order Placed!');
        } else {
          toast.error('Failed to finalize order record');
        }
      } catch (err) {
        console.error('Finalization error:', err);
      } finally {
        setVerifying(false);
      }
    };

    finalizePayment();
  }, [reservationId, confirmPayment]);

  if (verifying) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-bold animate-pulse">Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center">
      <div className="mb-8 flex justify-center">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-500 animate-bounce-slow">
          <CheckCircle2 className="w-12 h-12" />
        </div>
      </div>

      <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 italic">
        Payment Successful!
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-lg mb-12">
        Thank you for choosing EasyDine. Your payment has been securely processed and your session is now settled.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        <Card className="p-6 border-green-100 dark:border-green-900/30 bg-green-50/30 dark:bg-green-900/5">
          <p className="text-xs font-black text-green-600 uppercase tracking-widest mb-1">Reservation ID</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">#{reservationId}</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
          <p className="text-xl font-bold text-green-500 uppercase">Settled</p>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={() => navigate('/my-orders')}
          size="lg"
          className="bg-brand-orange hover:bg-brand-gold shadow-lg shadow-brand-orange/20 px-8"
        >
          View My Orders <ShoppingBag className="w-4 h-4 ml-2" />
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => navigate('/order-track/' + reservationId)}
          className="px-8"
        >
          Order Tracking <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <p className="mt-12 text-sm text-gray-400">
        A digital receipt has been generated. You can download it from the order tracking page.
      </p>
    </div>
  );
}
