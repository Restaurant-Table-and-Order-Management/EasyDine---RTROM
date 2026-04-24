import React, { useState } from 'react';
import { X, CreditCard, Banknote, Smartphone, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';
import Button from '../ui/Button';
import useDataStore from '../../store/dataStore';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'STRIPE', label: 'Pay with Stripe', icon: Zap, color: 'text-indigo-500', bg: 'bg-indigo-500/10', description: 'Secure online payment via Stripe' },
];

export default function PaymentModal({ isOpen, onClose, onConfirm, amount, reservationId }) {
  const [selectedMethod, setSelectedMethod] = useState('STRIPE');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { createStripeCheckoutSession } = useDataStore();

  const handlePayment = async () => {
    if (!selectedMethod) return;
    
    // Handle Stripe redirect flow
    if (selectedMethod === 'STRIPE') {
      setIsProcessing(true);
      try {
        const safeReservationId = reservationId || 0;
        const result = await createStripeCheckoutSession(safeReservationId, amount);
        if (result.success && result.data?.url) {
          // Redirect to Stripe Checkout
          window.location.href = result.data.url;
        } else {
          toast.error(result.message || 'Failed to initiate Stripe payment');
          setIsProcessing(false);
        }
      } catch (error) {
        toast.error('Failed to connect to Stripe');
        setIsProcessing(false);
      }
      return;
    }

    // Handle standard payment methods (Cash, Card, UPI)
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsSuccess(true);
    
    // Smooth delay before confirming the order
    setTimeout(() => {
        onConfirm(selectedMethod);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={!isProcessing ? onClose : undefined}
      />
      
      <div className="relative w-full max-w-md animate-scale-in">
        <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
          
          {isSuccess ? (
            <div className="p-12 text-center flex flex-col items-center animate-fade-in">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-500 mb-6 animate-bounce-slow">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Payment Successful!</h2>
                <p className="text-gray-500">Your order is being sent to the kitchen.</p>
            </div>
          ) : (
            <>
                {/* Header */}
                <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Billing & Payment</h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Secure Transaction</p>
                    </div>
                    <button 
                        disabled={isProcessing}
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors disabled:opacity-30"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Amount Summary */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-800/10 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-gray-800">
                        <span className="text-gray-500 font-medium">Total Amount Payable</span>
                        <span className="text-2xl font-black text-brand-orange">₹{amount.toFixed(2)}</span>
                    </div>

                    {/* Method Selection */}
                    <div className="space-y-3">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Select Payment Method</p>
                        {PAYMENT_METHODS.map((method) => {
                            const Icon = method.icon;
                            const isActive = selectedMethod === method.id;
                            const isStripe = method.id === 'STRIPE';
                            return (
                                <button
                                    key={method.id}
                                    disabled={isProcessing}
                                    onClick={() => setSelectedMethod(method.id)}
                                    className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all duration-200 group relative overflow-hidden
                                        ${isActive 
                                            ? isStripe 
                                                ? 'border-indigo-500 bg-indigo-500/[0.03]' 
                                                : 'border-brand-orange bg-brand-orange/[0.03]' 
                                            : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 bg-white dark:bg-transparent'}`}
                                >
                                    <div className={`p-3 rounded-xl transition-colors ${method.bg} ${method.color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="text-left flex-1 min-w-0">
                                        <p className={`font-bold transition-colors ${isActive ? (isStripe ? 'text-indigo-500' : 'text-brand-orange') : 'text-gray-900 dark:text-white'}`}>
                                            {method.label}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">{method.description}</p>
                                    </div>
                                    {isActive && <div className={`w-2 h-2 rounded-full animate-pulse ${isStripe ? 'bg-indigo-500' : 'bg-brand-orange'}`}></div>}
                                </button>
                            );
                        })}
                    </div>

                    <div className="pt-2">
                        <Button 
                            fullWidth 
                            size="lg"
                            disabled={!selectedMethod || isProcessing}
                            onClick={handlePayment}
                            className={`h-14 text-white text-lg font-black ${
                                selectedMethod === 'STRIPE' 
                                    ? 'bg-indigo-600 hover:bg-indigo-700' 
                                    : 'bg-gray-900 dark:bg-brand-orange'
                            }`}
                        >
                            {isProcessing 
                                ? (selectedMethod === 'STRIPE' ? 'Redirecting to Stripe...' : 'Verifying Transaction...') 
                                : selectedMethod === 'STRIPE' 
                                    ? `Pay ₹${amount.toFixed(2)} with Stripe` 
                                    : `Confirm & Pay ₹${amount.toFixed(2)}`
                            }
                        </Button>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> End-to-End Encrypted
                    </div>
                </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
