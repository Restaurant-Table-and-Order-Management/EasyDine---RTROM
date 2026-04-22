import React, { useState, useEffect } from 'react';
import { 
  X, Printer, CreditCard, Receipt, Hash, User, MapPin, Tag, 
  Smartphone, Banknote, Users, Percent, ChevronRight, CheckCircle2,
  Sparkles, ArrowLeft, Smartphone as QrCode
} from 'lucide-react';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const TIP_PRESETS = [5, 10, 15];

export default function BillModal({ bill, onClose, onConfirmPayment }) {
  const [step, setStep] = useState('review'); // review, adjust, method, processing, success
  const [tipPercent, setTipPercent] = useState(0);
  const [splitCount, setSplitCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Card state
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  if (!bill) return null;

  const subtotal = bill.subtotal;
  const tax = bill.taxAmount;
  const tipAmount = subtotal * (tipPercent / 100);
  const grandTotal = subtotal + tax + tipAmount;
  const perPerson = grandTotal / splitCount;

  const handleNextStep = () => {
    if (step === 'review') setStep('adjust');
    else if (step === 'adjust') setStep('method');
  };

  const handleBackStep = () => {
    if (step === 'adjust') setStep('review');
    else if (step === 'method') setStep('adjust');
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setStep('processing');
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const res = await onConfirmPayment();
    if (res?.success !== false) {
        setStep('success');
    } else {
        setStep('method');
        setIsProcessing(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'review':
        return (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
             <table className="w-full">
                <thead>
                   <tr className="text-left text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">
                      <th className="pb-3 px-1">Description</th>
                      <th className="pb-3 text-center">Qty</th>
                      <th className="pb-3 text-right">Price</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                   {bill.items.map((item, idx) => (
                      <tr key={idx}>
                          <td className="py-3 px-1">
                              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.name}</p>
                              <p className="text-[10px] text-gray-400 font-medium">₹{item.unitPrice.toFixed(2)} / unit</p>
                          </td>
                          <td className="py-3 text-center text-sm font-bold text-gray-600 dark:text-gray-400">{item.quantity}</td>
                          <td className="py-3 text-right text-sm font-black text-gray-900 dark:text-white">₹{item.totalPrice.toFixed(2)}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        );

      case 'adjust':
        return (
          <div className="flex-1 overflow-y-auto p-6 space-y-8 animate-in slide-in-from-right-4 duration-300">
             {/* Tipping */}
             <div>
                <div className="flex items-center gap-2 mb-4">
                    <Percent className="w-4 h-4 text-brand-orange" />
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">Add a Tip</h3>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {TIP_PRESETS.map(p => (
                        <button 
                            key={p}
                            onClick={() => setTipPercent(p)}
                            className={`py-3 rounded-xl text-xs font-black transition-all ${tipPercent === p ? 'bg-brand-orange text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}
                        >
                            {p}%
                        </button>
                    ))}
                    <button 
                        onClick={() => setTipPercent(0)}
                        className={`py-3 rounded-xl text-xs font-black transition-all ${tipPercent === 0 ? 'bg-brand-orange text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}
                    >
                        None
                    </button>
                </div>
             </div>

             {/* Splitting */}
             <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-brand-orange" />
                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">Split Bill</h3>
                    </div>
                    <span className="text-xs font-black text-brand-orange bg-brand-orange/10 px-2 py-1 rounded-lg">
                        {splitCount} People
                    </span>
                </div>
                <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={splitCount}
                    onChange={(e) => setSplitCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                />
                <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400 uppercase">
                    <span>Single</span>
                    <span>Group (Max 10)</span>
                </div>
                
                {splitCount > 1 && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Each guest pays</p>
                        <p className="text-xl font-black text-brand-orange">₹{perPerson.toFixed(2)}</p>
                    </div>
                )}
             </div>
          </div>
        );

      case 'method':
        return (
          <div className="flex-1 overflow-y-auto p-6 space-y-3 animate-in slide-in-from-right-4 duration-300">
             <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">Select Payment Method</h3>
             
             <button 
                onClick={() => setPaymentMethod('upi')}
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'upi' ? 'border-brand-orange bg-brand-orange/5' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'}`}
             >
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500"><Smartphone className="w-6 h-6" /></div>
                    <div className="text-left">
                        <p className="text-sm font-black text-gray-900 dark:text-white">UPI / QR Code</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Fast & Secure</p>
                    </div>
                </div>
                {paymentMethod === 'upi' && <div className="w-4 h-4 rounded-full bg-brand-orange border-4 border-white dark:border-gray-900 shadow-sm" />}
             </button>

             <button 
                onClick={() => setPaymentMethod('card')}
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'card' ? 'border-brand-orange bg-brand-orange/5' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'}`}
             >
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500"><CreditCard className="w-6 h-6" /></div>
                    <div className="text-left">
                        <p className="text-sm font-black text-gray-900 dark:text-white">Credit / Debit Card</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Global Standards</p>
                    </div>
                </div>
                {paymentMethod === 'card' && <div className="w-4 h-4 rounded-full bg-brand-orange border-4 border-white dark:border-gray-900 shadow-sm" />}
             </button>

             <button 
                onClick={() => setPaymentMethod('cash')}
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'cash' ? 'border-brand-orange bg-brand-orange/5' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'}`}
             >
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-500/10 rounded-xl text-green-500"><Banknote className="w-6 h-6" /></div>
                    <div className="text-left">
                        <p className="text-sm font-black text-gray-900 dark:text-white">Cash Payment</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Pay at Counter</p>
                    </div>
                </div>
                {paymentMethod === 'cash' && <div className="w-4 h-4 rounded-full bg-brand-orange border-4 border-white dark:border-gray-900 shadow-sm" />}
             </button>
          </div>
        );

      case 'processing':
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center h-[400px]">
             {paymentMethod === 'upi' ? (
                <div className="space-y-6 animate-pulse">
                    <div className="p-6 bg-white dark:bg-gray-800 border-4 border-gray-100 dark:border-gray-700 rounded-3xl shadow-xl flex items-center justify-center mx-auto w-48 h-48">
                         <QrCode className="w-32 h-32 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <p className="text-lg font-black text-gray-900 dark:text-white">Scan to Pay</p>
                        <p className="text-sm font-bold text-gray-500">Redirecting to UPI application...</p>
                    </div>
                </div>
             ) : paymentMethod === 'card' ? (
                <div className="space-y-6 w-full">
                    <div className="w-full max-w-[280px] h-44 bg-gradient-to-br from-gray-800 to-black rounded-2xl mx-auto p-6 text-left shadow-2xl relative overflow-hidden flex flex-col justify-between">
                         <div className="flex justify-between items-start">
                             <div className="w-10 h-8 bg-yellow-400/20 rounded-md border border-yellow-400/30" />
                             <CreditCard className="text-white/20 w-8 h-8" />
                         </div>
                         <div className="space-y-1">
                             <p className="text-white/30 text-[8px] font-bold uppercase tracking-widest">Card Holder</p>
                             <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
                         </div>
                         <div className="space-y-1">
                             <p className="text-white/30 text-[8px] font-bold uppercase tracking-widest">Card Number</p>
                             <p className="text-white font-mono text-sm tracking-[0.2em]">**** **** **** 4242</p>
                         </div>
                    </div>
                    <div>
                        <p className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Verifying Card...</p>
                        <div className="mt-4 flex justify-center gap-1">
                             <div className="w-2 h-2 rounded-full bg-brand-orange animate-bounce [animation-delay:-0.3s]" />
                             <div className="w-2 h-2 rounded-full bg-brand-orange animate-bounce [animation-delay:-0.15s]" />
                             <div className="w-2 h-2 rounded-full bg-brand-orange animate-bounce" />
                        </div>
                    </div>
                </div>
             ) : (
                <div className="space-y-6">
                    <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto text-green-500">
                         <Banknote className="w-12 h-12" />
                    </div>
                    <div>
                        <p className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Waiting for Waiter</p>
                        <p className="text-sm font-bold text-gray-500">Marking table as paid manually...</p>
                    </div>
                </div>
             )}
          </div>
        );

      case 'success':
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full animate-in zoom-in-50 duration-500">
             <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-xl shadow-green-500/20 mb-6 group relative">
                 <CheckCircle2 className="w-10 h-10 text-white" />
                 <Sparkles className="absolute -top-2 -right-2 text-yellow-400 w-6 h-6 animate-bounce" />
             </div>
             <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">Check Settled!</h2>
             <p className="text-sm text-gray-500 font-medium mb-8">The table is now available and the session is closed.</p>
             
             <div className="w-full space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 mb-6 print:hidden">
                <p className="text-[10px] font-black text-gray-400 uppercase text-left ml-1">Send Digital Copy</p>
                <div className="flex gap-2">
                    <input 
                        type="email" 
                        placeholder="customer@email.com"
                        id="receipt-email"
                        className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-brand-orange/20 outline-none"
                    />
                    <Button size="sm" className="px-4" onClick={handleSendEmail}>Email</Button>
                </div>
             </div>

             <Button variant="outline" className="px-8 rounded-full print:hidden" onClick={onClose}>Finish</Button>
          </div>
        );

      default: return null;
    }
  };

  const handleSendEmail = async () => {
    const email = document.getElementById('receipt-email')?.value;
    if (!email) {
        toast.error('Please enter an email address');
        return;
    }
    const { sendEmailReceipt } = useDataStore.getState();
    const res = await sendEmailReceipt(bill.reservationId, email);
    if (res.success) toast.success('Receipt emailed!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 print:bg-white print:p-0">
        <style dangerouslySetInnerHTML={{ __html: `
            @media print {
                .print\\:hidden { display: none !important; }
                body * { visibility: hidden; }
                .bill-print-container, .bill-print-container * { visibility: visible; }
                .bill-print-container { position: absolute; left: 0; top: 0; width: 100%; }
                .animate-in { animation: none !important; }
                .shadow-2xl { shadow: none !important; }
            }
        `}} />

      <div className="bg-white dark:bg-surface-dark-deep w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col min-h-[500px] max-h-[90vh] bill-print-container print:shadow-none print:rounded-none">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20 shrink-0">
          <div className="flex items-center gap-3">
             {step !== 'review' && step !== 'success' && step !== 'processing' ? (
                <button onClick={handleBackStep} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 print:hidden">
                   <ArrowLeft className="w-4 h-4" />
                </button>
             ) : (
                <div className="w-10 h-10 rounded-xl bg-brand-orange text-white flex items-center justify-center">
                    <Receipt className="w-5 h-5" />
                </div>
             )}
             <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                    {step === 'adjust' ? 'Total & Splits' : step === 'method' ? 'Secure Pay' : 'Digital Invoice'}
                </h2>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Session #{bill.reservationId}</p>
             </div>
          </div>
          {step !== 'processing' && step !== 'success' && (
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 print:hidden">
                <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Area */}
        {renderStepContent()}

        {/* Bottom Total Summary (Sticky) */}
        {step !== 'success' && step !== 'processing' && (
            <div className="p-6 bg-gray-50/80 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800 shrink-0">
                <div className="flex justify-between items-end mb-4">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total to Pay</p>
                        <div className="flex items-center gap-2">
                           <p className="text-2xl font-black text-gray-900 dark:text-white">₹{grandTotal.toFixed(2)}</p>
                           {tipPercent > 0 && <span className="text-[10px] font-black text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded-md">+{tipPercent}% TIP</span>}
                        </div>
                    </div>
                    {splitCount > 1 && (
                        <div className="text-right">
                            <p className="text-[10px] font-black text-brand-orange uppercase">Share per guest</p>
                            <p className="text-sm font-black text-brand-orange">₹{perPerson.toFixed(2)}</p>
                        </div>
                    )}
                </div>

                {step === 'method' ? (
                    <Button 
                        className="w-full h-14 rounded-2xl bg-brand-orange text-white shadow-xl shadow-brand-orange/20" 
                        disabled={!paymentMethod || isProcessing}
                        onClick={handleProcessPayment}
                    >
                        <Lock className="w-4 h-4 mr-2" /> Pay and Settle Check
                    </Button>
                ) : (
                    <Button 
                        className="w-full h-14 rounded-2xl bg-brand-orange text-white shadow-xl shadow-brand-orange/20" 
                        onClick={handleNextStep}
                    >
                        Review Adjustments <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                )}
            </div>
        )}
      </div>
    </div>
  );
}

// Missing Lock icon import fix
function Lock(props) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
