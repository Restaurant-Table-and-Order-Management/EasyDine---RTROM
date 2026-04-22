import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Filter, Search, RotateCcw, 
  CheckCircle2, AlertCircle, Calendar, ArrowLeft,
  DollarSign, Receipt, CreditCard, Banknote
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useDataStore from '../../store/dataStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getTodayDate, formatDate } from '../../utils/dateHelpers';
import toast from 'react-hot-toast';

export default function AdminBillingPage() {
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const { fetchAdminBills, processRefund, fetchAllReservations, reservations } = useDataStore();
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    // Fetch detailed ledger
    const res = await fetchAdminBills(selectedDate);
    if (res.success) setBills(res.data);
    
    // Also fetch general reservations to get statuses (Refunded vs Completed)
    await fetchAllReservations(selectedDate, 'ALL');
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const handleRefund = async (id) => {
    if (!window.confirm('Are you sure you want to refund this bill? This action is irreversible.')) return;
    
    const res = await processRefund(id);
    if (res.success) {
        toast.success('Refund processed successfully');
        loadData();
    } else {
        toast.error(res.message);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Session ID', 'Customer', 'Table', 'Subtotal', 'Tax', 'Total', 'Status'];
    const csvRows = [headers.join(',')];
    
    bills.forEach(bill => {
      const reservation = reservations.find(r => r.id === bill.reservationId);
      const row = [
        bill.reservationId,
        `"${bill.customerName}"`,
        `Table ${bill.tableNumber}`,
        bill.subtotal.toFixed(2),
        bill.taxAmount.toFixed(2),
        bill.grandTotal.toFixed(2),
        reservation?.status || 'PAID'
      ];
      csvRows.push(row.join(','));
    });
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `EasyDine_Bills_${selectedDate}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin')}
            className="p-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:scale-105 transition-all text-gray-400"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Finance Ledger</h1>
            <p className="text-gray-500 font-medium">Audit and manage your daily transactions</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-orange" />
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-11 pr-6 h-14 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl font-black text-gray-900 dark:text-white focus:ring-brand-orange/20 focus:border-brand-orange transition-all uppercase tracking-tighter cursor-pointer"
              />
           </div>
           <Button onClick={handleExportCSV} variant="outline" className="h-14 px-6 border-2 border-gray-100 dark:border-gray-700 font-black uppercase tracking-tighter text-xs">
              <Download className="w-4 h-4 mr-2" /> Export CSV
           </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-surface-dark dark:to-gray-800 shadow-sm">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Audit Volume</p>
             <h3 className="text-2xl font-black text-gray-900 dark:text-white">₹{bills.reduce((acc, curr) => acc + curr.grandTotal, 0).toFixed(2)}</h3>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-surface-dark dark:to-gray-800 shadow-sm">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Sessions Count</p>
             <h3 className="text-2xl font-black text-gray-900 dark:text-white">{bills.length}</h3>
          </Card>
      </div>

      {/* Ledger Table */}
      <Card className="overflow-hidden border-2 border-gray-50 dark:border-gray-800">
        <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
           <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
             <Receipt className="w-4 h-4 text-brand-orange" /> Detailed Transactions
           </h2>
           <div className="text-[10px] font-bold text-gray-400 uppercase">Viewing: {formatDate(selectedDate)}</div>
        </div>

        {loading ? (
             <div className="p-20 flex justify-center"><LoadingSpinner size="lg" /></div>
        ) : bills.length === 0 ? (
             <div className="p-20 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-400">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <p className="text-gray-500 font-bold">No financial activity recorded for this date.</p>
             </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white dark:bg-surface-dark border-b border-gray-50 dark:border-gray-800">
                            <th className="px-6 py-4">Session ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Table</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                        {bills.map((bill) => {
                            const reservation = reservations.find(r => r.id === bill.reservationId);
                            const isRefunded = reservation?.status === 'REFUNDED';
                            
                            return (
                                <tr key={bill.id} className={`hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors ${isRefunded ? 'opacity-60 grayscale' : ''}`}>
                                    <td className="px-6 py-4">
                                        <span className="font-black text-gray-500 text-xs">#{bill.reservationId}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center font-black text-xs">
                                                {bill.customerName.charAt(0)}
                                            </div>
                                            <span className="font-bold text-gray-900 dark:text-white text-sm">{bill.customerName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-tighter">Table {bill.tableNumber}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-sm font-black ${isRefunded ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                                            ₹{bill.grandTotal.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {isRefunded ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-wider border border-red-100 dark:border-red-900/30">
                                                <RotateCcw className="w-3 h-3" /> Refunded
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-wider border border-green-100 dark:border-green-900/30">
                                                <CheckCircle2 className="w-3 h-3" /> Settled
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {!isRefunded && (
                                            <button 
                                                onClick={() => handleRefund(bill.reservationId)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                title="Process Refund"
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                            </button>
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
    </div>
  );
}
