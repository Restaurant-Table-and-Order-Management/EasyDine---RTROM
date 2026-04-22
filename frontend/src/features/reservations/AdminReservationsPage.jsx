import React, { useEffect, useState, useCallback } from 'react';
import { Calendar, Filter, RefreshCw, ClipboardList, Search, Download, Clock, Users, ArrowUpRight, CheckCircle, XCircle } from 'lucide-react';
import useDataStore from '../../store/dataStore';
import ReservationCard from './ReservationCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { getTodayDate } from '../../utils/dateHelpers';

export default function AdminReservationsPage() {
  const {
    reservations,
    reservationsLoading,
    fetchAllReservations,
    confirmReservation,
    cancelReservation,
    checkInGuest,
  } = useDataStore();

  const [dateFilter, setDateFilter] = useState(''); // Default to all dates initially
  const [datePreset, setDatePreset] = useState('ALL'); // ALL, TODAY, TOMORROW
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const loadReservations = useCallback(() => {
    fetchAllReservations(dateFilter, 'ALL'); // Always fetch ALL statuses, then filter locally for UI snappiness if possible, or fetch via API if preferred. Let's rely on API + local.
  }, [fetchAllReservations, dateFilter]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  // Handle Preset Date Filters
  const handleDatePreset = (preset) => {
      setDatePreset(preset);
      const today = getTodayDate();
      
      if(preset === 'TODAY') {
          setDateFilter(today);
      } else if (preset === 'TOMORROW') {
          const tmrw = new Date();
          tmrw.setDate(tmrw.getDate() + 1);
          setDateFilter(tmrw.toISOString().split('T')[0]);
      } else {
          setDateFilter('');
      }
  };

  const handleConfirm = async (id) => {
    const loadingId = toast.loading('Confirming reservation...');
    const result = await confirmReservation(id);
    if (result.success) {
      toast.success('Reservation confirmed successfully', { id: loadingId });
    } else {
      toast.error(result.message, { id: loadingId });
    }
  };

  const handleCancel = async (id) => {
      // Small simulated confirmation dialog logic for realism
      if(!window.confirm("Are you sure you want to cancel this reservation?")) return;
      
      const loadingId = toast.loading('Cancelling reservation...');
      const result = await cancelReservation(id);
      if (result.success) {
        toast.success('Reservation cancelled', { id: loadingId });
      } else {
        toast.error(result.message, { id: loadingId });
      }
  };
  
  const handleCheckIn = async (id) => {
      const loadingId = toast.loading('Checking in guest...');
      const result = await checkInGuest(id);
      if (result.success) {
        toast.success('Guest seated and table occupied', { id: loadingId });
      } else {
        toast.error(result.message, { id: loadingId });
      }
  };

  const clearFilters = () => {
    setDateFilter('');
    setDatePreset('ALL');
    setStatusFilter('ALL');
    setSearchQuery('');
  };

  // Local filtering (Search & Status)
  const filteredReservations = reservations.filter(r => {
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
      if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchName = r.userName?.toLowerCase().includes(q);
          const matchTable = r.tableNumber?.toLowerCase().includes(q) || r.tableId?.toString().includes(q);
          if(!matchName && !matchTable) return false;
      }
      return true;
  });

  // Count stats
  const pendingCount = filteredReservations.filter((r) => r.status === 'PENDING').length;
  const confirmedCount = filteredReservations.filter((r) => r.status === 'CONFIRMED').length;

  return (
    <div className="flex flex-col xl:flex-row gap-6 max-w-7xl mx-auto animate-fade-in">
      
      {/* Main Content */}
      <div className="flex-1 space-y-6 min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Reservation Manager
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Review, confirm, and manage seating requests
            </p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" className="hidden sm:flex bg-white dark:bg-surface-dark items-center gap-2 shadow-sm border-gray-200 dark:border-gray-700 hover:bg-gray-50" size="sm">
                <Download className="w-4 h-4"/> Export CSV
             </Button>
            <Button onClick={loadReservations} size="sm" className="shadow-md shadow-brand-orange/20">
              <RefreshCw className="w-4 h-4 mr-1.5" />
              New Reservation
            </Button>
          </div>
        </div>

        {/* Smart Filter Bar */}
        <Card className="p-4 bg-white dark:bg-surface-dark border-0 ring-1 ring-gray-100 dark:ring-gray-800 shadow-sm">
           <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-800 pb-3 h-8">
               <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                   <Filter className="w-3.5 h-3.5 text-brand-orange" /> Smart Filters
               </h3>
               {(dateFilter || statusFilter !== 'ALL' || searchQuery) && (
                   <button onClick={clearFilters} className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors">Clear All Filters</button>
               )}
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
               {/* Search */}
               <div className="md:col-span-4">
                   <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Search Customer / Table</label>
                   <div className="relative">
                       <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input 
                           type="text" 
                           placeholder="Search..." 
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all"
                       />
                   </div>
               </div>

               {/* Date Picker Group */}
               <div className="md:col-span-5">
                   <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Date Range</label>
                   <div className="flex bg-gray-50 dark:bg-gray-800/50 rounded-xl p-1 border border-gray-200 dark:border-gray-700">
                       <button onClick={()=>handleDatePreset('ALL')} className={`flex-1 text-xs font-medium py-1.5 rounded-lg transition-colors ${datePreset==='ALL' ? 'bg-white dark:bg-surface-dark shadow-sm text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600' : 'text-gray-500 hover:text-gray-700'}`}>All</button>
                       <button onClick={()=>handleDatePreset('TODAY')} className={`flex-1 text-xs font-medium py-1.5 rounded-lg transition-colors ${datePreset==='TODAY' ? 'bg-white dark:bg-surface-dark shadow-sm text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600' : 'text-gray-500 hover:text-gray-700'}`}>Today</button>
                       <button onClick={()=>handleDatePreset('TOMORROW')} className={`flex-1 text-xs font-medium py-1.5 rounded-lg transition-colors ${datePreset==='TOMORROW' ? 'bg-white dark:bg-surface-dark shadow-sm text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600' : 'text-gray-500 hover:text-gray-700'}`}>Tmrw</button>
                       <div className="w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
                       <input 
                           type="date"
                           value={dateFilter}
                           onChange={(e) => {
                               setDateFilter(e.target.value);
                               setDatePreset('');
                           }}
                           className="text-xs bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 w-[120px] px-2 cursor-pointer"
                       />
                   </div>
               </div>

               {/* Status */}
               <div className="md:col-span-3">
                   <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Status</label>
                   <select
                       value={statusFilter}
                       onChange={(e) => setStatusFilter(e.target.value)}
                       className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                   >
                       <option value="ALL">All Statuses</option>
                       <option value="PENDING">Pending</option>
                       <option value="CONFIRMED">Confirmed</option>
                       <option value="CANCELLED">Cancelled</option>
                   </select>
               </div>
           </div>
        </Card>

        {/* Results Stream */}
        {reservationsLoading ? (
          <div className="flex justify-center p-12"><LoadingSpinner text="Loading reservations..." /></div>
        ) : filteredReservations.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-3xl mt-4">
            <div className="flex justify-center mb-6">
                <img src="https://illustrations.popsy.co/amber/graphic-design.svg" alt="Empty" className="w-48 h-48 opacity-80" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No reservations found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
              There are no matching reservations for your current filters. Try adjusting the date or status.
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        ) : (
          <div className="space-y-3 mt-2">
              {/* Optional: Add a subtle counter above list */}
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1 mb-2">
                  Showing {filteredReservations.length} records
              </div>
              
            {filteredReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                onCheckIn={handleCheckIn}
                showCustomerName
                isAdminView
              />
            ))}
          </div>
        )}
      </div>

      {/* Right Sidebar - Analytics & Actions */}
      <div className="w-full xl:w-80 flex-shrink-0 space-y-6">
          {/* Reservation Analytics */}
          <Card className="bg-white dark:bg-surface-dark border-0 ring-1 ring-gray-100 dark:ring-gray-800 shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-5 flex items-center justify-between">
                  Reservation Analytics
                  {datePreset === 'TODAY' && <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-green-100 text-green-700 uppercase">Today</span>}
              </h3>

              <div className="space-y-5">
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl text-blue-500">
                          <Users className="w-5 h-5"/>
                      </div>
                      <div>
                          <p className="text-xs text-gray-500 font-medium">Total Volume</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{filteredReservations.length} Bookings</p>
                      </div>
                  </div>

                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-xl text-green-500">
                          <CheckCircle className="w-5 h-5"/>
                      </div>
                      <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">Confirmation Rate</p>
                          <div className="flex items-baseline gap-2 mb-1">
                              <p className="text-lg font-bold text-gray-900 dark:text-white">
                                  {filteredReservations.length > 0 ? Math.round((confirmedCount/filteredReservations.length)*100) : 0}%
                              </p>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-green-500 h-full" style={{width: `${filteredReservations.length > 0 ? (confirmedCount/filteredReservations.length)*100 : 0}%`}}></div>
                          </div>
                      </div>
                  </div>
              </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-5 border-0 bg-gradient-to-br from-gray-50 to-white dark:from-surface-dark dark:to-surface-dark relative overflow-hidden shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
             <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 rounded-full blur-xl -mr-10 -mt-10"></div>
             
             <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 relative z-10">Quick Actions</h3>
             
             <div className="space-y-2 relative z-10">
                 <button className="w-full text-left px-4 py-3 rounded-xl bg-orange-50/50 hover:bg-orange-50 dark:bg-orange-900/10 dark:hover:bg-orange-900/20 text-brand-orange transition-colors flex items-center justify-between group border border-transparent hover:border-orange-200 dark:hover:border-orange-800/30">
                     <div className="flex flex-col">
                         <span className="text-sm font-semibold">Review Pending</span>
                         <span className="text-xs opacity-70">{pendingCount} awaiting approval</span>
                     </div>
                     <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                 </button>

                 <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center justify-between group border border-gray-200 dark:border-gray-700">
                     <span className="text-sm font-medium">Send Reminders</span>
                     <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                 </button>
             </div>
          </Card>

          {/* Activity Feed Mock */}
          <Card className="p-5 border-0 ring-1 ring-gray-100 dark:ring-gray-800 shadow-sm">
             <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                 <Clock className="w-4 h-4 text-gray-400" /> Recent Activity
             </h3>
             <div className="space-y-4">
                 <div className="flex items-start gap-3">
                     <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                     <div>
                         <p className="text-sm text-gray-900 dark:text-white"><span className="font-semibold">John Doe</span> confirmed Table 5</p>
                         <p className="text-xs text-gray-500 mt-0.5">10 minutes ago</p>
                     </div>
                 </div>
                 <div className="flex items-start gap-3">
                     <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                     <div>
                         <p className="text-sm text-gray-900 dark:text-white"><span className="font-semibold">System</span> cancelled #1024</p>
                         <p className="text-xs text-gray-500 mt-0.5">1 hour ago • No show</p>
                     </div>
                 </div>
                 <div className="flex items-start gap-3">
                     <div className="w-2 h-2 rounded-full bg-brand-orange mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(255,123,0,0.5)]"></div>
                     <div>
                         <p className="text-sm text-gray-900 dark:text-white">New booking from <span className="font-semibold">Alice M.</span></p>
                         <p className="text-xs text-gray-500 mt-0.5">2 hours ago • Requires review</p>
                     </div>
                 </div>
             </div>
          </Card>
      </div>

    </div>
  );
}
