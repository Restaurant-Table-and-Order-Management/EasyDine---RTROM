import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  CalendarCheck,
  Settings,
  ClipboardList,
  LogOut,
  Menu,
  ChefHat,
  Utensils,
  Users,
  ShoppingBag,
  Bell,
  CheckCircle2,
  Clock,
  Wallet,
  History
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useDataStore from '../../store/dataStore';
import { playConfirmationChime } from '../../utils/chime';
import ReservationConfirmedPopup from '../../features/reservations/ReservationConfirmedPopup';
import useCartStore from '../../store/cartStore';
import ThemeToggle from '../common/ThemeToggle';
import CartDrawer from './CartDrawer';
import { NAV_ITEMS, ROLE_BADGES } from '../../utils/constants';

const iconMap = {
  LayoutDashboard,
  Search,
  CalendarCheck,
  Settings,
  ClipboardList,
  Utensils,
  Users,
  ShoppingBag,
  Wallet,
  History,
};

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const { 
    reservations, 
    fetchMyReservations,
    notifications,
    addNotification,
    markNotificationsAsRead,
    myOrders,
    fetchMyOrders
  } = useDataStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [activePopup, setActivePopup] = useState(null);
  
  const notifRef = useRef(null);
  
  const { getTotalItems } = useCartStore();
  const cartItemCount = getTotalItems();

  const role = user?.role || 'CUSTOMER';

  // Global Notification Polling
  useEffect(() => {
    if (role !== 'CUSTOMER') return;

    fetchMyReservations(true); // Initial silent fetch
    fetchMyOrders(true); // Initial silent fetch
    
    const pollInterval = setInterval(() => {
      fetchMyReservations(true);
      fetchMyOrders(true);
    }, 5000);
    
    return () => clearInterval(pollInterval);
  }, [role, fetchMyReservations, fetchMyOrders]);

  const notifiedIds = useRef(new Set());

  // Load notified IDs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('notified_reservations');
    if (saved) {
      try {
        const ids = JSON.parse(saved);
        if (Array.isArray(ids)) {
          ids.forEach(id => notifiedIds.current.add(id));
        }
      } catch (e) {
        console.error('Error parsing notified IDs', e);
      }
    }
  }, []);

  const notifiedOrderIds = useRef(new Map()); // id -> lastKnownStatus

  // Global Notification Trigger for Reservations
  useEffect(() => {
    if (role !== 'CUSTOMER') return;

    // We only trigger for CONFIRMED bookings that haven't been notified in this browser/session before
    const pendingToConfirmed = reservations.find(r => 
      r.status === 'CONFIRMED' && !notifiedIds.current.has(r.id)
    );

    if (pendingToConfirmed) {
      setActivePopup(pendingToConfirmed);
      playConfirmationChime();
      
      // Update local set and persist to localStorage
      notifiedIds.current.add(pendingToConfirmed.id);
      localStorage.setItem('notified_reservations', JSON.stringify(Array.from(notifiedIds.current)));
      
      // Add to persistent notification list in store
      addNotification({
        type: 'RESERVATION_CONFIRMED',
        title: 'Booking Confirmed!',
        message: `Table ${pendingToConfirmed.tableNumber} is reserved for you.`,
        data: pendingToConfirmed
      });
    }
  }, [reservations, role, addNotification]);

  // Global Notification Trigger for Orders
  useEffect(() => {
    if (role !== 'CUSTOMER') return;

    myOrders.forEach(order => {
      const lastStatus = notifiedOrderIds.current.get(order.id);
      
      // Trigger notification if status changed to READY or SERVED
      if (lastStatus && lastStatus !== order.status) {
        if (order.status === 'READY') {
          playConfirmationChime();
          addNotification({
            type: 'ORDER_READY',
            title: 'Order Ready! 🍳',
            message: `Your order #${order.id.toString().slice(-4)} is ready to be served.`,
            data: order
          });
        } else if (order.status === 'SERVED') {
          addNotification({
            type: 'ORDER_SERVED',
            title: 'Enjoy your meal! 🍽️',
            message: `Order #${order.id.toString().slice(-4)} has been served at your table.`,
            data: order
          });
        }
      }
      
      // Update last known status
      notifiedOrderIds.current.set(order.id, order.status);
    });
  }, [myOrders, role, addNotification]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Handle click outside notification panel
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notifOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const subtitle = role === 'ADMIN'
    ? 'Admin Control Panel'
    : role === 'STAFF'
    ? 'Kitchen View'
    : 'RTROM';

  const navItems = NAV_ITEMS[role] || NAV_ITEMS.CUSTOMER;
  const roleBadge = ROLE_BADGES[role] || ROLE_BADGES.CUSTOMER;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-6 border-b border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center shadow-lg shadow-brand-orange/20">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                EasyDine
              </h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                {subtitle}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const IconComponent = iconMap[item.icon];
          if (item.disabled) {
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 dark:text-gray-600 cursor-not-allowed"
              >
                {IconComponent && <IconComponent className="w-5 h-5 flex-shrink-0" />}
                {!sidebarCollapsed && <span>{item.label}</span>}
                {!sidebarCollapsed && (
                  <span className="ml-auto text-[9px] bg-gray-100 dark:bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                )}
              </div>
            );
          }
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive
                  ? 'bg-brand-orange/10 text-brand-orange dark:bg-brand-gold/10 dark:text-brand-gold shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                }`
              }
            >
              {IconComponent && <IconComponent className="w-5 h-5 flex-shrink-0" />}
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-700/50 space-y-2">
        <ThemeToggle collapsed={sidebarCollapsed} />

        {!sidebarCollapsed && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-orange to-brand-gold flex items-center justify-center text-white text-xs font-bold shadow-md">
              {getInitials(user?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.name || 'User'}
              </p>
              <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleBadge}`}>
                {role}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 border border-transparent hover:border-red-200 dark:hover:border-red-800/30"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark-deep flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-white dark:bg-surface-dark border-r border-gray-100 dark:border-gray-700/50 transition-all duration-300 flex-shrink-0
          ${sidebarCollapsed ? 'w-[72px]' : 'w-64'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <SidebarContent />
        <button
          onClick={() => setSidebarCollapsed((prev) => !prev)}
          className="hidden lg:flex absolute -right-3 top-8 w-6 h-6 rounded-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-600 items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shadow-sm transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg className={`w-3 h-3 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-30 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700/50 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Open sidebar">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center">
              <ChefHat className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-sm">EasyDine</span>
          </div>

          <div className="flex items-center gap-2">
            {role === 'CUSTOMER' && (
              <button 
                onClick={() => setCartOpen(true)}
                className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all relative"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-orange text-white text-[10px] font-black flex items-center justify-center shadow-lg shadow-brand-orange/20 animate-scale-in">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex sticky top-0 z-30 bg-white/40 dark:bg-surface-dark-deep/40 backdrop-blur-xl px-8 py-4 items-center justify-end gap-4">
          {role === 'CUSTOMER' && (
            <>
              {/* Notification Center */}
              <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => {
                    setNotifOpen(!notifOpen);
                    if (!notifOpen) markNotificationsAsRead();
                  }}
                  className="p-2.5 rounded-2xl bg-white dark:bg-surface-dark text-gray-600 dark:text-gray-300 hover:text-brand-orange border border-gray-100 dark:border-gray-800 shadow-sm transition-all group"
                >
                  <Bell className={`w-5 h-5 transition-transform ${notifOpen ? 'scale-110 text-brand-orange' : 'group-hover:scale-110'}`} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center shadow-md animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute top-full right-0 mt-3 w-80 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                    <div className="p-4 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Notifications</h3>
                      <button onClick={markNotificationsAsRead} className="text-[10px] font-bold text-brand-orange hover:underline">Mark all read</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-12 text-center">
                          <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
                             <Clock className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                          </div>
                          <p className="text-xs text-gray-400 font-medium tracking-tight">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div 
                            key={n.id} 
                            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0 cursor-pointer ${!n.read ? 'bg-brand-orange/5' : ''}`} 
                            onClick={() => {navigate('/my-reservations'); setNotifOpen(false);}}
                          >
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <p className="text-xs font-bold text-gray-900 dark:text-white">{n.title}</p>
                                  {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" />}
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1">{n.message}</p>
                                <p className="text-[8px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">
                                   {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setCartOpen(true)}
                className="px-4 py-2 rounded-2xl bg-white dark:bg-surface-dark text-gray-600 dark:text-gray-300 hover:text-brand-orange dark:hover:text-brand-orange border border-gray-100 dark:border-gray-800 shadow-sm transition-all flex items-center gap-3 group relative"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-brand-orange text-white text-[9px] font-black flex items-center justify-center shadow-md">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold">My Order</span>
              </button>
            </>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      {activePopup && (
        <ReservationConfirmedPopup 
          reservation={activePopup} 
          onClose={() => setActivePopup(null)} 
        />
      )}
    </div>
  );
}
