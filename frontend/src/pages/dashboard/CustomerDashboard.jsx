import React, { useEffect, useState } from 'react';
import {
  CalendarCheck,
  Search,
  Star,
  MapPin,
  Clock,
<<<<<<< HEAD
  ChevronRight,
  Zap,
  Coffee
=======
  ChevronRight
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useDataStore from '../../store/dataStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate, formatTime, getTodayDate } from '../../utils/dateHelpers';

export default function CustomerDashboard() {
  const { user } = useAuthStore();
  const { reservations, fetchMyReservations } = useDataStore();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    date: getTodayDate(),
    time: '19:00',
    capacity: 2
  });

  useEffect(() => {
    fetchMyReservations();
  }, [fetchMyReservations]);

  const upcomingReservations = reservations.filter(
    (r) =>
      r.reservationDate >= getTodayDate() &&
      (r.status === 'PENDING' || r.status === 'CONFIRMED')
  ).sort((a, b) => a.reservationDate.localeCompare(b.reservationDate));

  const completedCount = reservations.filter(r => r.status === 'COMPLETED' || r.status === 'CONFIRMED').length;

<<<<<<< HEAD
  const activeReservations = reservations.filter(
    (r) =>
      r.reservationDate === getTodayDate() &&
      r.status === 'CONFIRMED'
      // Simple heuristic: if it's today and confirmed, it's a live session
  );

=======
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
  const handleSearch = (e) => {
      e.preventDefault();
      // Simple routing with params to tables search page
      navigate(`/tables`);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in flex flex-col lg:flex-row gap-8">
      {/* Left Column (Main) */}
      <div className="flex-1 space-y-8">
          
        {/* Welcome Hero Banner */}
<<<<<<< HEAD
        <div className="relative rounded-3xl overflow-hidden bg-gray-900 shadow-xl min-h-[300px]">
=======
        <div className="relative rounded-3xl overflow-hidden bg-gray-900 shadow-xl h-[280px]">
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
           {/* Beautiful background image */}
           <img 
               src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1600" 
               alt="Restaurant interior" 
               className="absolute inset-0 w-full h-full object-cover opacity-50"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
           
<<<<<<< HEAD
           <div className="relative p-8 flex flex-col justify-end h-full pt-16">
=======
           <div className="absolute inset-0 p-8 flex flex-col justify-end">
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
               <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">
                   Welcome back, {user?.name?.split(' ')[0]}!
               </h1>
               <p className="text-lg text-gray-300 max-w-lg mb-6">
                   Ready for your next dining experience? Find and book your favorite tables seamlessly.
               </p>
               
               {/* Quick booking form IN the banner */}
<<<<<<< HEAD
               <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl flex flex-wrap items-center gap-2 w-full">
=======
               <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl flex flex-col sm:flex-row gap-2 max-w-3xl">
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
                   <input 
                       type="date" 
                       min={getTodayDate()}
                       required
                       value={searchParams.date}
                       onChange={e => setSearchParams({...searchParams, date: e.target.value})}
<<<<<<< HEAD
                       className="flex-1 min-w-[140px] px-4 py-3 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange text-sm font-medium"
=======
                       className="px-4 py-3 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange text-sm font-medium w-full sm:w-auto"
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
                   />
                   <input 
                       type="time" 
                       required
                       step="1800"
                       value={searchParams.time}
                       onChange={e => setSearchParams({...searchParams, time: e.target.value})}
<<<<<<< HEAD
                       className="flex-1 min-w-[120px] px-4 py-3 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange text-sm font-medium"
=======
                       className="px-4 py-3 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange text-sm font-medium w-full sm:w-auto"
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
                   />
                   <select 
                       value={searchParams.capacity}
                       onChange={e => setSearchParams({...searchParams, capacity: Number(e.target.value)})}
<<<<<<< HEAD
                       className="flex-1 min-w-[110px] px-4 py-3 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange text-sm font-medium"
=======
                       className="px-4 py-3 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange text-sm font-medium w-full sm:w-28"
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
                   >
                       {[1,2,3,4,5,6,8,10,12].map(n => (
                           <option key={n} value={n}>{n} Guests</option>
                       ))}
                   </select>
<<<<<<< HEAD
                   <Button type="submit" className="whitespace-nowrap px-6 rounded-xl bg-brand-orange text-white shrink-0">
=======
                   <Button type="submit" className="whitespace-nowrap px-8 rounded-xl bg-brand-orange text-white flex-1 sm:flex-none">
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
                       Find Tables
                   </Button>
               </form>
           </div>
        </div>

<<<<<<< HEAD
        {/* Active Session Alert (If any) */}
        {activeReservations.length > 0 && (
          <Card className="bg-gradient-to-r from-brand-orange/10 to-brand-gold/10 border-brand-orange/20 shadow-lg p-0 overflow-hidden group mb-8">
             <div className="flex flex-col sm:flex-row items-center gap-6 p-6">
                <div className="w-16 h-16 rounded-2xl bg-brand-orange text-white flex items-center justify-center shadow-lg shadow-brand-orange/20 animate-bounce-slow shrink-0">
                   <Zap className="w-8 h-8 fill-white" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                   <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1">You have a Live Session!</h3>
                   <p className="text-gray-500 text-sm italic pr-4 tracking-tight">Table #{activeReservations[0].tableNumber} is ready for your orders. Track and manage your meal in real-time.</p>
                </div>
                <Button 
                   onClick={() => navigate(`/order-track/${activeReservations[0].id}`)}
                   className="whitespace-nowrap bg-brand-orange hover:bg-brand-orange-dark shadow-md"
                >
                   Track My Order <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
             </div>
          </Card>
        )}

=======
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
        {/* Upcoming Reservations List */}
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Upcoming Bookings
                </h3>
                {upcomingReservations.length > 0 && (
                     <button onClick={() => navigate('/my-reservations')} className="text-sm font-semibold text-brand-orange hover:text-brand-orange-dark flex items-center transition-colors">
                        View All <ChevronRight className="w-4 h-4 ml-0.5" />
                    </button>
                )}
            </div>

            {upcomingReservations.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-12 text-center text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/20 border-dashed">
                    <CalendarCheck className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">You don't have any upcoming reservations.</p>
                    <p className="text-sm mb-6 mt-1">Book your next meal and it will appear here.</p>
                    <Button onClick={() => navigate('/tables')}>Find a Table</Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {upcomingReservations.slice(0, 4).map(res => (
                        <Card key={res.id} hover className="p-0 overflow-hidden flex flex-col cursor-pointer border border-transparent hover:border-brand-orange/30 group transition-all duration-300">
                             <div className="bg-surface-light dark:bg-surface-dark-deep p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                 <div>
                                     <p className="text-xs font-semibold text-brand-orange tracking-widest uppercase mb-1">
                                         {formatDate(res.reservationDate)}
                                     </p>
                                     <p className="text-lg font-bold text-gray-900 dark:text-white leading-none">
                                         {formatTime(res.startTime)}
                                     </p>
                                 </div>
                                 <StatusBadge status={res.status} />
                             </div>
                             <div className="p-4 flex justify-between items-center flex-1">
                                 <div className="flex items-center gap-3">
                                     <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-brand-orange">
                                         T-{res.tableNumber || res.tableId}
                                     </div>
                                     <div>
                                         <p className="font-semibold text-gray-900 dark:text-white">Reserved Table</p>
                                         <p className="text-sm text-gray-500">{res.guestCount} Guests set</p>
                                     </div>
                                 </div>
                                 <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-orange transition-colors" />
                             </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* Right Column (Sidebar widget) */}
      <div className="w-full lg:w-80 space-y-6">
         <Card className="bg-white dark:bg-surface-dark shadow-xl ring-1 ring-gray-100 dark:ring-gray-800 overflow-hidden">
             <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                 <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Your Stats</h2>
                 <p className="text-sm text-gray-500">Since joining EasyDine</p>
             </div>
             
             <div className="p-6 space-y-6">
                 <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                         <Star className="w-6 h-6" />
                     </div>
                     <div>
                         <p className="text-sm text-gray-500 font-medium">Total Bookings</p>
                         <p className="text-2xl font-bold text-gray-900 dark:text-white">{reservations.length}</p>
                     </div>
                 </div>

                 <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                         <Clock className="w-6 h-6" />
                     </div>
                     <div>
                         <p className="text-sm text-gray-500 font-medium">Upcoming</p>
                         <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcomingReservations.length}</p>
                     </div>
                 </div>

                 <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                         <MapPin className="w-6 h-6" />
                     </div>
                     <div>
                         <p className="text-sm text-gray-500 font-medium">Favorite Spot</p>
                         <p className="text-lg font-bold text-gray-900 dark:text-white truncate">Window Seats</p>
                     </div>
                 </div>
             </div>
             
             <div className="p-6 pt-0">
                 <div className="w-full bg-gradient-to-r from-brand-orange to-brand-gold p-4 rounded-2xl text-white shadow-md">
                     <p className="text-sm font-bold mb-1 flex items-center gap-2"><Star className="w-4 h-4 fill-white" /> Silver Member</p>
                     <p className="text-xs text-white/80">{20 - completedCount} more visits to Gold</p>
                     <div className="w-full bg-black/20 h-1.5 rounded-full mt-3 overflow-hidden">
                         <div className="bg-white h-full rounded-full" style={{ width: `${(completedCount/20)*100}%` }}></div>
                     </div>
                 </div>
             </div>
         </Card>
      </div>

    </div>
  );
}
