import React, { useState, useEffect } from 'react';
import { History, RefreshCcw, Search, ArrowLeft, CheckCircle2, XCircle, Calendar, Hash, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useDataStore from '../../store/dataStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/dateHelpers';

export default function PastOrdersPage() {
  const { pastOrders, ordersLoading, fetchPastOrders } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPastOrders();
  }, [fetchPastOrders]);

  const filteredOrders = pastOrders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
        order.id.toString().includes(searchLower) ||
        (order.customerName && order.customerName.toLowerCase().includes(searchLower)) ||
        (order.tableNumber && order.tableNumber.toString().includes(searchLower))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50 p-4 sm:p-6 space-y-6 animate-fade-in">
        {/* Header Ribbon */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate('/staff/dashboard')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors group mr-2"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-brand-orange" />
                </button>
                
                <div className="flex items-center gap-3 pr-4 border-r border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center shadow-lg shadow-brand-orange/20">
                        <History className="w-6 h-6 text-white" />
                    </div>
                    <div className="hidden sm:block">
                        <span className="text-xs font-black text-brand-orange uppercase tracking-widest block leading-none mb-1">EasyDine</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Kitchen Hub</span>
                    </div>
                </div>

                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                        Order History
                    </h1>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400">View and track all served or cancelled orders</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-orange transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search order, table or guest..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                    />
                </div>
                <button 
                    onClick={fetchPastOrders}
                    className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-400 hover:text-brand-orange transition-colors"
                >
                    <RefreshCcw className={`w-5 h-5 ${ordersLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-white dark:bg-surface-dark border-none shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                    <History className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Records</p>
                    <p className="text-xl font-black text-gray-900 dark:text-white">{pastOrders.length}</p>
                </div>
            </Card>
            <Card className="p-4 bg-white dark:bg-surface-dark border-none shadow-sm flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Served Successfully</p>
                    <p className="text-xl font-black text-gray-900 dark:text-white">
                        {pastOrders.filter(o => o.status === 'SERVED').length}
                    </p>
                </div>
            </Card>
            <Card className="p-4 bg-white dark:bg-surface-dark border-none shadow-sm flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-xl">
                    <XCircle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cancelled</p>
                    <p className="text-xl font-black text-gray-900 dark:text-white">
                        {pastOrders.filter(o => o.status === 'CANCELLED').length}
                    </p>
                </div>
            </Card>
        </div>

        {/* Results List */}
        <div className="space-y-4">
            {ordersLoading && pastOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <LoadingSpinner size="lg" text="Loading History..." />
                </div>
            ) : filteredOrders.length === 0 ? (
                <Card className="py-20 text-center border-dashed bg-white dark:bg-surface-dark">
                    <History className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">No history found</h3>
                    <p className="text-gray-500 text-sm">Either no orders have been completed yet or search didn't match.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredOrders.map(order => (
                        <Card key={order.id} className="p-0 overflow-hidden bg-white dark:bg-surface-dark border-none shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${order.status === 'CANCELLED' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                                        {order.status === 'CANCELLED' ? <XCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-sm font-black text-gray-900 dark:text-white">Order #{order.id}</span>
                                            <StatusBadge status={order.status} />
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5" /> {order.customerName}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Hash className="w-3.5 h-3.5" /> Table {order.tableNumber || order.tableId}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" /> {formatDate(order.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-gray-50">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Grand Total</p>
                                        <p className="text-lg font-black text-gray-900 dark:text-white">₹{(order.totalAmount || 0).toFixed(2)}</p>
                                    </div>
                                    <div className="w-px h-10 bg-gray-100 hidden md:block"></div>
                                    <div className="flex -space-x-2">
                                        {order.items?.slice(0, 3).map((item, idx) => (
                                            <div key={idx} className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[10px] font-black text-gray-600" title={item.menuItemName}>
                                                {item.quantity}
                                            </div>
                                        ))}
                                        {order.items?.length > 3 && (
                                            <div className="w-8 h-8 rounded-full bg-brand-orange text-white border-2 border-white dark:border-gray-800 flex items-center justify-center text-[10px] font-black">
                                                +{order.items.length - 3}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Summary Footer */}
                            <div className="bg-gray-50/50 dark:bg-gray-800/20 px-4 py-2 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                <span>{order.items?.length || 0} Items Ordered</span>
                                {order.status === 'CANCELLED' && order.cancellationReason && (
                                    <span className="text-red-400 italic font-medium">Reason: {order.cancellationReason}</span>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
}
