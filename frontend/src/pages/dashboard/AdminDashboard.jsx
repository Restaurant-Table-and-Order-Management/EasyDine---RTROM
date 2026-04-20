import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Clock,
  LayoutGrid,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Database,
  Users,
  Activity,
  Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useDataStore from '../../store/dataStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, formatTime, getTodayDate } from '../../utils/dateHelpers';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const {
    reservations,
    reservationsLoading,
    fetchAllReservations,
    tables,
    tablesLoading,
    fetchTables,
  } = useDataStore();
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchAllReservations('', 'ALL');
    fetchTables();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // update every minute

    return () => clearInterval(timer);
  }, [fetchAllReservations, fetchTables]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const todayStr = getTodayDate();
  
  // Analytics for today
  const todaysReservations = reservations.filter(r => r.reservationDate === todayStr);
  const pendingCount = todaysReservations.filter((r) => r.status === 'PENDING').length;
  
  const totalTables = tables.length;
  const occupiedTables = tables.filter((t) => t.status === 'OCCUPIED').length;
  const availableTables = tables.filter((t) => t.status === 'AVAILABLE').length;

  // Mock revenue for today based on confirmed/occupied past/present
  const mockRevenue = todaysReservations.filter(r => r.status === 'CONFIRMED' || r.status === 'COMPLETED').length * 45;

  const isLoading = reservationsLoading || tablesLoading;

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." />;
  }

  // Live timeline data (mocked from actual reservations for visual purposes)
  const timelineTimes = ['11:00', '12:00', '13:00', '14:00', '18:00', '19:00', '20:00', '21:00'];

  return (
    <div className="animate-fade-in flex flex-col lg:flex-row gap-6">
      <div className="flex-1 space-y-6">
        {/* Welcome section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'Admin'} 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              {' '}•{' '}
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="flex gap-2">
            {/* Quick Actions Bar */}
            <Button onClick={() => navigate('/admin/tables')} variant="outline" className="bg-white dark:bg-surface-dark shadow-sm hover:shadow-md">
              <LayoutGrid className="w-4 h-4 mr-2" /> Floor Status
            </Button>
            <Button onClick={() => navigate('/admin/tables')} className="shadow-md shadow-brand-orange/20">
              <Plus className="w-4 h-4 mr-2" /> Add Table
            </Button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent z-0"></div>
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Tables</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalTables}</p>
                  <span className="text-xs font-semibold text-green-500 flex items-center">
                    ↑ 2
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                <LayoutGrid className="w-5 h-5" />
              </div>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full mt-4 overflow-hidden">
               <div className="bg-blue-500 h-full rounded-full" style={{ width: '100%' }}></div>
            </div>
          </Card>

          <Card className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent z-0"></div>
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Available Now</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{availableTables}</p>
                  <span className="text-xs font-semibold text-gray-400 flex items-center">
                    {totalTables > 0 ? Math.round((availableTables/totalTables)*100) : 0}% capacity
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </div>
             <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full mt-4 overflow-hidden flex">
               <div className="bg-green-500 h-full" style={{ width: `${(availableTables/totalTables)*100}%` }}></div>
               <div className="bg-orange-500 h-full" style={{ width: `${(occupiedTables/totalTables)*100}%` }}></div>
            </div>
          </Card>

          <Card className="relative overflow-hidden group ring-1 ring-yellow-400/50 shadow-lg shadow-yellow-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent z-0"></div>
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Pending Requests</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
                   {pendingCount > 0 && (
                     <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        Needs Action
                     </span>
                   )}
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-colors duration-300">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
             <div className="mt-4">
                <button onClick={() => navigate('/admin/reservations')} className="text-xs font-semibold text-yellow-600 hover:text-yellow-700 dark:text-yellow-500 flex items-center">
                    Review now <ArrowRight className="w-3 h-3 ml-1" />
                </button>
             </div>
          </Card>

          <Card className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-transparent z-0"></div>
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Today's Revenue</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">${mockRevenue}</p>
                  <span className="text-xs font-semibold text-green-500 flex items-center">
                    ↑ 12%
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            {/* Sparkline mock */}
            <div className="mt-4 flex items-end gap-1 h-6 opacity-60">
              <div className="w-full bg-brand-orange/40 rounded-t h-[40%]"></div>
              <div className="w-full bg-brand-orange/40 rounded-t h-[30%]"></div>
              <div className="w-full bg-brand-orange/40 rounded-t h-[60%]"></div>
              <div className="w-full bg-brand-orange/60 rounded-t h-[80%]"></div>
              <div className="w-full bg-brand-orange/80 rounded-t h-[100%]"></div>
              <div className="w-full bg-brand-orange/40 rounded-t h-[50%]"></div>
              <div className="w-full bg-brand-orange rounded-t h-[90%]"></div>
            </div>
          </Card>
        </div>

        {/* Live Reservations Timeline */}
        <Card className="pt-5 pb-6 px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Live Reservations Timeline</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/reservations')}>View All</Button>
          </div>
          
          <div className="relative overflow-x-auto pb-4">
             <div className="min-w-[700px]">
                {/* Time header */}
                <div className="flex border-b border-gray-100 dark:border-gray-800 pb-2 mb-4">
                   <div className="w-20 pl-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Table</div>
                   <div className="flex-1 flex justify-between px-2">
                       {timelineTimes.map(time => (
                           <span key={time} className="text-xs font-medium text-gray-500">{time}</span>
                       ))}
                   </div>
                </div>

                {/* Table rows */}
                <div className="space-y-4">
                   {tables.slice(0, 5).map(table => {
                       // Find mock reservations for this table
                       const tableRes = todaysReservations.filter(r => r.tableId === table.id);
                       
                       return (
                           <div key={table.id} className="flex items-center group">
                               <div className="w-20 font-medium text-sm text-gray-900 dark:text-white group-hover:text-brand-orange transition-colors">
                                   T-{table.tableNumber}
                               </div>
                               <div className="flex-1 relative h-10 bg-gray-50 dark:bg-gray-800/50 rounded-lg mx-2 border border-dashed border-gray-200 dark:border-gray-700">
                                   {/* Map actual reservations onto timeline (very rough mock visualization) */}
                                   {tableRes.map((r, i) => {
                                       // Simple pseudo-positioning based on time block
                                       const hour = parseInt(r.startTime.split(':')[0]);
                                       let left = '0%';
                                       if(hour >= 12 && hour < 14) left = '20%';
                                       if(hour >= 18 && hour < 20) left = '60%';
                                       if(hour >= 20) left = '80%';
                                       
                                       const colorClass = r.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' 
                                            : r.status === 'CONFIRMED' ? 'bg-green-100 text-green-800 border-green-300'
                                            : 'bg-gray-200 text-gray-800 border-gray-400';

                                       return (
                                           <div 
                                               key={r.id} 
                                               className={`absolute top-1 bottom-1 w-1/5 rounded-md border shadow-sm px-2 py-1 overflow-hidden cursor-pointer hover:shadow-md transition-all ${colorClass}`}
                                               style={{ left }}
                                               title={`Reservation ${r.id}: ${r.guestCount} guests`}
                                            >
                                               <p className="text-[10px] font-bold truncate">#{r.id} • {r.guestCount}p</p>
                                           </div>
                                       )
                                   })}
                               </div>
                           </div>
                       );
                   })}
                </div>
             </div>
          </div>
        </Card>
      </div>

      {/* Right Panel - System Health */}
      <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0 shadow-xl relative overflow-hidden">
             {/* Decorative rings */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>

             <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                 <Activity className="w-5 h-5 text-brand-gold" /> System Health
             </h3>
             
             <div className="space-y-5">
                 <div className="flex items-center justify-between pb-3 border-b border-white/10">
                     <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                         <span className="text-sm font-medium text-gray-300">Database Status</span>
                     </div>
                     <span className="text-sm font-bold text-green-400">Connected</span>
                 </div>
                 
                 <div className="flex items-center justify-between pb-3 border-b border-white/10">
                     <div className="flex items-center gap-3">
                         <Database className="w-4 h-4 text-gray-400" />
                         <span className="text-sm font-medium text-gray-300">Last Sync</span>
                     </div>
                     <span className="text-sm font-bold">{formatTime(currentTime.toTimeString().split(' ')[0])}</span>
                 </div>
                 
                 <div className="flex items-center justify-between pb-3 border-b border-white/10">
                     <div className="flex items-center gap-3">
                         <Users className="w-4 h-4 text-gray-400" />
                         <span className="text-sm font-medium text-gray-300">Active Sessions</span>
                     </div>
                     <span className="text-sm font-bold">12</span>
                 </div>

                 <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                         <Clock className="w-4 h-4 text-gray-400" />
                         <span className="text-sm font-medium text-gray-300">Server Uptime</span>
                     </div>
                     <span className="text-sm font-bold">99.98%</span>
                 </div>
             </div>
        </Card>

        {/* Quick Report Widget */}
        <Card>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Export Reports</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Generate daily summary for accounting and management.</p>
            <Button variant="outline" fullWidth className="dark:border-gray-700">
                Download Today's CSV
            </Button>
        </Card>
      </div>
    </div>
  );
}
