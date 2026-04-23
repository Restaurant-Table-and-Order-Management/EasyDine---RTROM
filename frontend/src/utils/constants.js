export const API_BASE_URL = 'http://localhost:8080/api';

export const TABLE_STATUSES = {
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED',
  OCCUPIED: 'OCCUPIED',
  MAINTENANCE: 'MAINTENANCE',
};

export const RESERVATION_STATUSES = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
};

export const ORDER_STATUSES = {
  PENDING: 'PENDING',
  PLACED: 'PLACED',
  PREPARING: 'PREPARING',
  COOKING: 'COOKING',
  PLATING: 'PLATING',
  READY: 'READY',
  SERVED: 'SERVED',
  CANCELLED: 'CANCELLED',
};

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  WAITER: 'WAITER',
  KITCHEN_STAFF: 'KITCHEN_STAFF',
  CUSTOMER: 'CUSTOMER',
};

export const TABLE_LOCATIONS = [
  'Window',
  'Garden',
  'VIP',
  'Indoor',
  'Outdoor',
  'Terrace',
  'Bar',
];

export const STATUS_COLORS = {
  AVAILABLE: 'bg-status-available/10 text-status-available border-status-available/20',
  RESERVED: 'bg-status-reserved/10 text-status-reserved border-status-reserved/20',
  OCCUPIED: 'bg-status-occupied/10 text-status-occupied border-status-occupied/20',
  MAINTENANCE: 'bg-status-maintenance/10 text-status-maintenance border-status-maintenance/20',
  PENDING: 'bg-status-pending/10 text-status-pending border-status-pending/20',
  CONFIRMED: 'bg-status-confirmed/10 text-status-confirmed border-status-confirmed/20',
  CANCELLED: 'bg-status-cancelled/10 text-status-cancelled border-status-cancelled/20',
  
  // Order specific
  PENDING: 'bg-gray-100 text-gray-500 border-gray-200',
  PLACED: 'bg-blue-500/10 text-blue-600 border-blue-200',
  PREPARING: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20',
  COOKING: 'bg-orange-500/10 text-orange-600 border-orange-200',
  PLATING: 'bg-pink-500/10 text-pink-600 border-pink-200',
  READY: 'bg-green-500/10 text-green-600 border-green-200',
  SERVED: 'bg-gray-100 text-gray-500 border-gray-200',
};

export const STATUS_DOT_COLORS = {
  AVAILABLE: 'bg-status-available',
  RESERVED: 'bg-status-reserved',
  OCCUPIED: 'bg-status-occupied',
  MAINTENANCE: 'bg-status-maintenance',
  PENDING: 'bg-status-pending',
  CONFIRMED: 'bg-status-confirmed',
  CANCELLED: 'bg-status-cancelled',
  PLACED: 'bg-blue-500',
  PREPARING: 'bg-brand-orange',
  COOKING: 'bg-orange-500',
  PLATING: 'bg-pink-500',
  READY: 'bg-green-500',
  SERVED: 'bg-gray-400',
};

export const TABLE_IMAGES = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=300&fit=crop',
];

export const NAV_ITEMS = {
  ADMIN: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'LayoutDashboard' },
    { label: 'Table Management', path: '/admin/tables', icon: 'Utensils' },
    { label: 'Menu Management', path: '/admin/menu', icon: 'ClipboardList' },
    { label: 'Reservations', path: '/admin/reservations', icon: 'CalendarCheck' },
  ],
  STAFF: [
    { label: 'Dashboard', path: '/staff/dashboard', icon: 'LayoutDashboard' },
    { label: "Today's Orders", path: '/staff/dashboard', icon: 'ClipboardList' },
  ],
  WAITER: [
    { label: 'Orders & Tables', path: '/staff/dashboard', icon: 'ClipboardList' },
  ],
  KITCHEN_STAFF: [
    { label: 'Kitchen Hub', path: '/staff/dashboard', icon: 'LayoutDashboard' },
    { label: 'Live Orders', path: '/kitchen/orders', icon: 'ClipboardList' },
  ],
  CUSTOMER: [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Browse Menu', path: '/menu', icon: 'Utensils' },
    { label: 'Find Tables', path: '/tables', icon: 'Search' },
    { label: 'My Reservations', path: '/my-reservations', icon: 'CalendarCheck' },
    { label: 'My Orders', path: '/my-orders', icon: 'ShoppingBag' },
  ],
};

export const QUICK_LOGIN_ACCOUNTS = {
  ADMIN: { email: 'admin@easydine.com', password: 'Admin@123', label: 'Quick Login as Admin', color: 'bg-red-500 hover:bg-red-600' },
  STAFF: { email: 'kitchen@easydine.com', password: 'Kitchen@123', label: 'Quick Login as Kitchen Staff', color: 'bg-blue-500 hover:bg-blue-600' },
  CUSTOMER: { email: 'customer@easydine.com', password: 'Customer@123', label: 'Quick Login as Customer', color: 'bg-green-500 hover:bg-green-600' },
};

export const ROLE_BADGES = {
  ADMIN: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20',
  STAFF: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  WAITER: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  KITCHEN_STAFF: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  CUSTOMER: 'bg-green-500/10 text-green-500 border-green-500/20',
};

export const ROLE_REDIRECT = {
  ADMIN: '/admin/dashboard',
  STAFF: '/staff/dashboard',
  WAITER: '/waiter/dashboard',
  KITCHEN_STAFF: '/staff/dashboard',
  CUSTOMER: '/dashboard',
};
