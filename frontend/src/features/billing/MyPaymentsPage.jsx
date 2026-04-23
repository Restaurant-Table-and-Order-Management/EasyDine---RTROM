import React, { useEffect, useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Receipt,
  AlertCircle,
  TrendingUp,
  History,
  DollarSign,
  Download
} from 'lucide-react';
import useDataStore from '../../store/dataStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, formatTime } from '../../utils/dateHelpers';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { generateSafeInvoicePDF } from '../../utils/pdfGenerator';

export default function MyPaymentsPage() {
  const { reservations, fetchMyReservations, fetchBill, confirmPayment } = useDataStore();
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      await fetchMyReservations();
      setLoading(false);
    };
    load();
  }, [fetchMyReservations]);

  const activeReservations = reservations.filter(r => r.status === 'CONFIRMED');
  const pastReservations = reservations.filter(r => r.status === 'COMPLETED');

  const handlePayNow = async (reservationId) => {
    setPayingId(reservationId);
    try {
        const res = await confirmPayment(reservationId, 'CASH');
        if (res.success) {
            toast.success('Payment successful! Your table session is now settled.');
            fetchMyReservations();
        } else {
            toast.error(res.message);
        }
    } catch (err) {
        toast.error('Payment failed. Please try again.');
    } finally {
        setPayingId(null);
    }
  };

  const handleDownloadInvoice = async (res) => {
    setDownloadingId(res.id);
    const loadingToast = toast.loading('Generating your invoice...');
    try {
        const result = await fetchBill(res.id);
        if (result.success) {
            generateSafeInvoicePDF(result.data, res);
            toast.success('Invoice downloaded', { id: loadingToast });
        } else {
            toast.error('Failed to fetch bill details', { id: loadingToast });
        }
    } catch (err) {
        toast.error('Error generating PDF', { id: loadingToast });
    } finally {
        setDownloadingId(null);
    }
  };

  if (loading) return <LoadingSpinner size="lg" text="Fetching your billing history..." />;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Payments & Billing</h1>
          <p className="text-gray-500 font-medium">Manage your active bills and transaction history</p>
        </div>
        <div className="flex bg-white dark:bg-surface-dark p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="px-4 py-2 bg-brand-orange/10 text-brand-orange rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Secure Payment
            </div>
        </div>
      </div>

      {/* Active Session Billing */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-brand-orange" />
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Active Sessions</h2>
        </div>
        
        {activeReservations.length === 0 ? (
            <Card className="p-12 text-center bg-gray-50/50 dark:bg-gray-800/10 border-dashed">
                <div className="w-16 h-16 bg-white dark:bg-surface-dark rounded-3xl flex items-center justify-center mx-auto mb-4 text-gray-200 dark:text-gray-700 shadow-inner">
                    <Receipt className="w-8 h-8" />
                </div>
                <p className="text-gray-500 font-medium italic">No active dining sessions found.</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/tables')}>Book a Table</Button>
            </Card>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeReservations.map(res => (
                    <ActiveBillCard 
                        key={res.id} 
                        reservation={res} 
                        onPay={() => handlePayNow(res.id)} 
                        isPaying={payingId === res.id}
                        onViewDetails={() => navigate(`/order-track/${res.id}`)}
                    />
                ))}
            </div>
        )}
      </section>

      {/* Payment History */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
            <History className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Past Transactions</h2>
        </div>

        <Card className="overflow-hidden border-0 ring-1 ring-gray-100 dark:ring-gray-800 shadow-xl">
            {pastReservations.length === 0 ? (
                <div className="p-16 text-center text-gray-400 italic">No past transactions found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                                <th className="px-6 py-4">Transaction ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Table</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {pastReservations.map(res => (
                                <tr key={res.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-xs font-bold text-gray-400">#PAY-{res.id.toString().padStart(6, '0')}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{formatDate(res.reservationDate)}</span>
                                            <span className="text-[10px] text-gray-500">{formatTime(res.startTime)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-[10px] font-black text-gray-500 uppercase">Table {res.tableNumber}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-green-500 uppercase">
                                            <CheckCircle2 className="w-3 h-3" /> Settled
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleDownloadInvoice(res)}
                                            disabled={downloadingId === res.id}
                                            className={`p-2 rounded-lg transition-all ${downloadingId === res.id ? 'bg-gray-100 animate-pulse' : 'text-gray-400 hover:text-brand-orange hover:bg-brand-orange/5'}`}
                                            title="Download PDF Invoice"
                                        >
                                            {downloadingId === res.id ? <LoadingSpinner size="sm" /> : <Download className="w-5 h-5" />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
      </section>
    </div>
  );
}

function ActiveBillCard({ reservation, onPay, isPaying, onViewDetails }) {
    const { fetchBill } = useDataStore();
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBill = async () => {
            const res = await fetchBill(reservation.id);
            if (res.success) setBill(res.data);
            setLoading(false);
        };
        loadBill();
    }, [reservation.id, fetchBill]);

    if (loading) return <div className="h-48 bg-gray-50 dark:bg-gray-800 animate-pulse rounded-3xl" />;

    return (
        <Card className="p-0 overflow-hidden border-2 border-brand-orange/20 hover:border-brand-orange/50 transition-all group">
            <div className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-surface-dark dark:to-gray-900">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center font-black shadow-inner">
                            {reservation.tableNumber}
                        </div>
                        <div>
                            <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tighter">Current Session</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active at {reservation.tableLocation || 'Main Hall'}</p>
                        </div>
                    </div>
                    <div className="px-3 py-1 bg-brand-orange/10 text-brand-orange rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-orange/20 animate-pulse">
                        Unpaid
                    </div>
                </div>

                <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-bold text-gray-900 dark:text-white">₹{bill?.subtotal.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tax (5% GST)</span>
                        <span className="font-bold text-gray-900 dark:text-white">₹{bill?.taxAmount.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <span className="text-sm font-black text-gray-900 dark:text-white uppercase">Total Amount</span>
                        <span className="text-2xl font-black text-brand-orange">₹{bill?.grandTotal.toFixed(2) || '0.00'}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl uppercase font-black tracking-tighter text-[10px]"
                        onClick={onViewDetails}
                    >
                        View Orders
                    </Button>
                    <Button 
                        size="sm" 
                        className="rounded-xl bg-gray-900 dark:bg-brand-orange uppercase font-black tracking-tighter text-[10px] shadow-lg shadow-brand-orange/20"
                        onClick={onPay}
                        loading={isPaying}
                        disabled={!bill || bill.grandTotal === 0}
                    >
                        <DollarSign className="w-3 h-3 mr-1" /> Pay Now
                    </Button>
                </div>
            </div>
        </Card>
    );
}
