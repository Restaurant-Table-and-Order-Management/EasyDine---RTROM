import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Filter, Search, RotateCcw, 
  CheckCircle2, AlertCircle, Calendar, ArrowLeft,
  DollarSign, Receipt, CreditCard, Banknote, Clock,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useDataStore from '../../store/dataStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getTodayDate, formatDate } from '../../utils/dateHelpers';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function AdminBillingPage() {
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const { fetchAdminBills, processRefund, fetchAllReservations, reservations } = useDataStore();
  const navigate = useNavigate();
  const [refundModal, setRefundModal] = useState({ isOpen: false, id: null });

  const loadData = async () => {
    setLoading(true);
    try {
        // Fetch detailed ledger
        const res = await fetchAdminBills(selectedDate);
        if (res.success) {
            setBills(res.data);
        }
        
        // Also fetch general reservations to get statuses (Refunded vs Completed)
        await fetchAllReservations(selectedDate, 'ALL');
    } catch (err) {
        toast.error("Failed to sync financial data");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const handleRefundClick = (id) => {
    setRefundModal({ isOpen: true, id });
  };

  const handleConfirmRefund = async () => {
    const { id } = refundModal;
    if (!id) return;
    
    const loadingId = toast.loading('Processing refund...');
    const res = await processRefund(id);
    if (res.success) {
        toast.success('Refund processed successfully', { id: loadingId });
        loadData();
    } else {
        toast.error(res.message, { id: loadingId });
    }
    setRefundModal({ isOpen: false, id: null });
  };

  const handleExportCSV = () => {
    if (bills.length === 0) {
        toast.error("No data to export");
        return;
    }
    const headers = ['Type', 'Session ID', 'Customer', 'Table', 'Subtotal', 'Tax', 'Total', 'Status'];
    const csvRows = [headers.join(',')];
    
    bills.forEach(bill => {
      const reservation = reservations.find(r => r.id === bill.reservationId);
      const isWalkIn = !bill.reservationId;
      const row = [
        isWalkIn ? 'Walk-in' : 'Reservation',
        bill.reservationId || 'N/A',
        `"${bill.customerName}"`,
        `Table ${bill.tableNumber}`,
        bill.subtotal.toFixed(2),
        bill.taxAmount.toFixed(2),
        bill.grandTotal.toFixed(2),
        isWalkIn ? 'SETTLED' : (reservation?.status || 'PENDING')
      ];
      csvRows.push(row.join(','));
    });
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `EasyDine_Finance_${selectedDate}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("CSV Exported");
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin')}
            className="p-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:scale-105 transition-all text-gray-400 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Finance Ledger</h1>
            <p className="text-gray-500 font-medium">Audit and manage your daily transactions</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-1 shadow-sm">
                <button 
                  onClick={() => setSelectedDate(getTodayDate())}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter transition-all ${selectedDate === getTodayDate() ? 'bg-brand-orange text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Today
                </button>
                <div className="relative flex items-center px-2">
                    <Calendar className="w-4 h-4 text-brand-orange mr-2" />
                    <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent border-0 outline-none font-black text-gray-900 dark:text-white text-xs uppercase tracking-tighter cursor-pointer"
                    />
                </div>
           </div>
           
           <button 
             onClick={loadData}
             className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:rotate-180 transition-all duration-500 text-gray-400 shadow-sm"
           >
              <RefreshCw className="w-5 h-5" />
           </button>

           <Button onClick={handleExportCSV} variant="outline" className="h-14 px-6 border-2 border-gray-100 dark:border-gray-700 font-black uppercase tracking-tighter text-xs shadow-sm hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" /> Export CSV
           </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-surface-dark dark:to-gray-800 shadow-sm border-0 ring-1 ring-gray-100 dark:ring-gray-800">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Audit Volume</p>
             <h3 className="text-3xl font-black text-gray-900 dark:text-white">₹{bills.reduce((acc, curr) => acc + curr.grandTotal, 0).toFixed(2)}</h3>
             <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-green-500">
                <TrendingUpIcon className="w-3 h-3" /> Includes Walk-ins
             </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-surface-dark dark:to-gray-800 shadow-sm border-0 ring-1 ring-gray-100 dark:ring-gray-800">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Sessions Count</p>
             <h3 className="text-3xl font-black text-gray-900 dark:text-white">{bills.length}</h3>
             <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-blue-500">
                <ActivityIcon className="w-3 h-3" /> Total Daily Traffic
             </div>
          </Card>
      </div>

      {/* Ledger Table */}
      <Card className="overflow-hidden border-0 ring-1 ring-gray-100 dark:ring-gray-800 shadow-xl">
        <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
           <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
             <Receipt className="w-4 h-4 text-brand-orange" /> Detailed Transactions
           </h2>
           <div className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg text-[10px] font-bold text-gray-400 border border-gray-100 dark:border-gray-700 shadow-sm">
             VIEWING: {formatDate(selectedDate)}
           </div>
        </div>

        {loading ? (
             <div className="p-20 flex justify-center"><LoadingSpinner size="lg" /></div>
        ) : bills.length === 0 ? (
             <div className="p-20 text-center space-y-6">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto text-gray-200 dark:text-gray-700 shadow-inner">
                    <AlertCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                    <p className="text-gray-900 dark:text-white text-xl font-black uppercase tracking-tighter">No financial activity</p>
                    <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto">We couldn't find any transactions for {formatDate(selectedDate)}. Try checking another date or refresh.</p>
                </div>
                <Button variant="outline" onClick={loadData} className="rounded-xl px-8 uppercase font-black tracking-tighter text-xs">
                    Refresh Ledger
                </Button>
             </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white dark:bg-surface-dark border-b border-gray-50 dark:border-gray-800">
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Customer Type</th>
                            <th className="px-6 py-4">Table</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800 bg-white dark:bg-surface-dark">
                        {bills.map((bill) => {
                            const reservation = reservations.find(r => r.id === bill.reservationId);
                            const isRefunded = reservation?.status === 'REFUNDED';
                            const isWalkIn = !bill.reservationId;
                            
                            return (
                                <tr key={bill.id} className={`hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors ${isRefunded ? 'opacity-60 grayscale' : ''}`}>
                                    <td className="px-6 py-4">
                                        <span className="font-black text-gray-400 text-[10px] tracking-tighter bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                                            #{isWalkIn ? bill.id.toString().substring(0, 4) : bill.reservationId}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-xl ${isWalkIn ? 'bg-purple-500/10 text-purple-500' : 'bg-brand-orange/10 text-brand-orange'} flex items-center justify-center font-black text-xs shadow-sm border border-current/10`}>
                                                {bill.customerName.charAt(0)}
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-900 dark:text-white text-sm block">{bill.customerName}</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{isWalkIn ? 'Direct Walk-in' : 'Reservation'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-black text-gray-500 uppercase tracking-tighter bg-gray-100 dark:bg-gray-800/50 px-2 py-1 rounded-md">
                                            {bill.tableNumber === 'N/A' ? 'No Table' : `Table ${bill.tableNumber}`}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-black ${isRefunded ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                                                ₹{bill.grandTotal.toFixed(2)}
                                            </span>
                                            <span className="text-[9px] font-bold text-gray-400">incl. tax</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {isRefunded ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-wider border border-red-100 dark:border-red-900/30 shadow-sm">
                                                <RotateCcw className="w-3 h-3" /> Refunded
                                            </span>
                                        ) : (reservation?.status === 'COMPLETED' || isWalkIn) ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-wider border border-green-100 dark:border-green-900/30 shadow-sm">
                                                <CheckCircle2 className="w-3 h-3" /> Settled
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-orange/10 text-brand-orange text-[10px] font-black uppercase tracking-wider border border-brand-orange/20 shadow-sm">
                                                <Clock className="w-3 h-3" /> Awaiting Settle
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {!isRefunded && !isWalkIn && reservation?.status === 'COMPLETED' && (
                                            <button 
                                                onClick={() => handleRefundClick(bill.reservationId)}
                                                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm border border-transparent hover:border-red-100"
                                                title="Process Refund"
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                            </button>
                                        )}
                                        {isWalkIn && (
                                            <span className="text-[10px] font-bold text-gray-300 uppercase italic px-3">System Settled</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        )}
      </Card>

      <ConfirmModal 
        isOpen={refundModal.isOpen}
        onClose={() => setRefundModal({ isOpen: false, id: null })}
        onConfirm={handleConfirmRefund}
        title="Refund Transaction"
        message="Are you sure you want to refund this bill? This action is irreversible and the revenue will be deducted from your daily total."
        confirmText="Confirm Refund"
        variant="danger"
      />
    </div>
  );
}

function TrendingUpIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
  );
}

function ActivityIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  );
}
