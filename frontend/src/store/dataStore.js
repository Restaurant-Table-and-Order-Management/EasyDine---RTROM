import { create } from 'zustand';
import api from '../api/axiosConfig';
import webSocketService from '../services/websocket';

const useDataStore = create((set, get) => ({
  // Tables state
  tables: [],
  tablesLoading: false,
  selectedTable: null,

  // Reservations state
  reservations: [],
  reservationsLoading: false,

  // Menu state
  menuItems: [],
  menuLoading: false,

  // Kitchen / Orders state
  activeOrders: [],
  readyOrders: [],
  pastOrders: [],
  myOrders: [],
  myOrdersLoading: false,
  ordersLoading: false,
  notifications: [],
  // Search state
  searchParams: {
    date: '',
    time: '',
    capacity: '',
  },
  searchResults: [],
  searchLoading: false,
  hasSearched: false,
  allUsers: [],
  usersLoading: false,

  // Right panel state
  rightPanelContent: null, // 'booking' | 'details' | null

  // ===================== TABLE ACTIONS =====================

  fetchTables: async () => {
    set({ tablesLoading: true });
    try {
      const response = await api.get('/tables');
      set({ tables: Array.isArray(response) ? response : (response.data || []), tablesLoading: false });
    } catch (error) {
      set({ tablesLoading: false });
    }
  },

  searchAvailableTables: async (date, time, capacity) => {
    set({ searchLoading: true, hasSearched: true });
    try {
      const response = await api.get('/tables/available', {
        params: { date, time, capacity: parseInt(capacity) },
      });
      set({
        searchResults: Array.isArray(response) ? response : (response.data || []),
        searchLoading: false,
        searchParams: { date, time, capacity },
      });
    } catch (error) {
      set({ searchResults: [], searchLoading: false });
    }
  },

  createTable: async (tableData) => {
    try {
      const response = await api.post('/tables', tableData);
      const newTable = response.data;
      set((state) => ({ tables: [...state.tables, newTable] }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create table',
      };
    }
  },

  updateTableStatus: async (tableId, status) => {
    try {
      await api.patch(`/tables/${tableId}/status`, null, {
        params: { status },
      });
      set((state) => ({
        tables: state.tables.map((t) =>
          t.id === tableId ? { ...t, status } : t
        ),
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update status',
      };
    }
  },

  deleteTable: async (id) => {
    try {
      await api.delete(`/tables/${id}`);
      set((state) => ({
        tables: state.tables.filter((item) => item.id !== id),
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete table',
      };
    }
  },
  selectTable: (table) => {
    set({ selectedTable: table, rightPanelContent: 'booking' });
  },

  clearSelectedTable: () => {
    set({ selectedTable: null, rightPanelContent: null });
  },

  // ===================== RESERVATION ACTIONS =====================

  createReservation: async (reservationData) => {
    try {
      await api.post('/reservations', reservationData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || 'Failed to create reservation',
      };
    }
  },

  fetchMyReservations: async (silent = false) => {
    if (!silent) set({ reservationsLoading: true });
    try {
      const response = await api.get('/reservations/my');
      set({ 
        reservations: Array.isArray(response) ? response : (response.data || []), 
        reservationsLoading: false 
      });
    } catch (error) {
      set({ reservationsLoading: false });
    }
  },

  fetchBill: async (reservationId) => {
    try {
      const response = await api.get(`/billing/reservation/${reservationId}`);
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to fetch bill' };
    }
  },

  confirmPayment: async (reservationId, paymentMethod) => {
    try {
      await api.post(`/billing/confirm/${reservationId}`, null, { params: { paymentMethod } });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Payment confirmation failed' 
      };
    }
  },

  fetchRevenueReport: async () => {
    try {
      const response = await api.get('/billing/report/revenue');
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: 'Failed to fetch report' };
    }
  },

  sendEmailReceipt: async (reservationId, email) => {
    try {
      await api.post('/billing/email-receipt', null, { params: { reservationId, email } });
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Email simulation failed' };
    }
  },

  fetchAdminBills: async (date) => {
    try {
      const response = await api.get('/billing/admin/ledger', { params: { date } });
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: 'Failed to fetch ledger' };
    }
  },

  processRefund: async (id) => {
    try {
      await api.post(`/billing/admin/refund/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Refund failed' };
    }
  },

  fetchAllReservations: async (date, status) => {
    set({ reservationsLoading: true });
    try {
      const params = {};
      if (date && date.trim() !== '') params.date = date;
      if (status && status !== 'ALL') params.status = status;
      const response = await api.get('/reservations', { params });
      set({ reservations: Array.isArray(response) ? response : (response.data || []), reservationsLoading: false });
    } catch (error) {
      set({ reservationsLoading: false });
    }
  },

  confirmReservation: async (reservationId) => {
    try {
      await api.put(`/reservations/${reservationId}/confirm`);
      set((state) => ({
        reservations: state.reservations.map((r) =>
          r.id === reservationId ? { ...r, status: 'CONFIRMED' } : r
        ),
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to confirm',
      };
    }
  },

  checkInGuest: async (reservationId) => {
    try {
      await api.put(`/reservations/${reservationId}/check-in`);
      // After check-in, we should refresh tables too since status changed to OCCUPIED
      const state = get();
      state.fetchTables(); 
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to check in',
      };
    }
  },

  cancelReservation: async (reservationId) => {
    try {
      await api.put(`/reservations/${reservationId}/cancel`);
      set((state) => ({
        reservations: state.reservations.map((r) =>
          r.id === reservationId ? { ...r, status: 'CANCELLED' } : r
        ),
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel',
      };
    }
  },

  // ===================== MENU ACTIONS =====================

  fetchMenuItems: async () => {
    set({ menuLoading: true });
    try {
      const response = await api.get('/menu');
      set({ menuItems: Array.isArray(response) ? response : (response.data || []), menuLoading: false });
    } catch (error) {
      set({ menuLoading: false });
    }
  },

  createMenuItem: async (menuData) => {
    try {
      const response = await api.post('/menu', menuData);
      const newItem = response.data || response;
      set((state) => ({ menuItems: [...state.menuItems, newItem] }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create menu item',
      };
    }
  },

  updateMenuItem: async (id, menuData) => {
    try {
      const response = await api.put(`/menu/${id}`, menuData);
      const updated = response.data || response;
      set((state) => ({
        menuItems: state.menuItems.map((item) =>
          item.id === id ? updated : item
        ),
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update menu item',
      };
    }
  },

  deleteMenuItem: async (id) => {
    try {
      await api.delete(`/menu/${id}`);
      set((state) => ({
        menuItems: state.menuItems.filter((item) => item.id !== id),
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete menu item',
      };
    }
  },
  // ===================== UI ACTIONS =====================

  setRightPanelContent: (content) => set({ rightPanelContent: content }),

  clearSearch: () =>
    set({
      searchResults: [],
      hasSearched: false,
      searchParams: { date: '', time: '', capacity: '' },
    }),

  // ===================== KITCHEN ACTIONS =====================

  fetchActiveOrders: async () => {
    set({ ordersLoading: true });
    try {
      const response = await api.get('/kitchen/orders');
      const orders = Array.isArray(response) ? response : (response.data || []);
      
      const currentOrders = get().activeOrders;
      const hasNew = orders.length > 0 && orders.some(newOrder => 
        !currentOrders.find(oldOrder => oldOrder.id === newOrder.id)
      );

      set({ activeOrders: orders, ordersLoading: false });
      return { success: true, hasNew };
    } catch (error) {
      set({ ordersLoading: false });
      return { success: false };
    }
  },

  initKitchenWebSocket: () => {
    webSocketService.connect();
    webSocketService.subscribe('/topic/kitchen/orders', (orders) => {
        set({ activeOrders: orders, ordersLoading: false });
    });
  },

  fetchPastOrders: async () => {
    set({ ordersLoading: true });
    try {
      const response = await api.get('/kitchen/orders/history');
      set({ pastOrders: Array.isArray(response) ? response : (response.data || []), ordersLoading: false });
      return { success: true };
    } catch (error) {
      set({ ordersLoading: false });
      return { success: false };
    }
  },

  fetchReadyOrders: async () => {
    set({ ordersLoading: true });
    try {
      const response = await api.get('/kitchen/orders');
      const orders = Array.isArray(response) ? response : (response.data || []);
      const readyOrders = orders.filter(o => o.status === 'READY');
      
      const currentReadyIds = get().readyOrders.map(o => o.id);
      const hasNew = readyOrders.some(o => !currentReadyIds.includes(o.id));

      set({ readyOrders: readyOrders, ordersLoading: false });
      return { success: true, hasNew };
    } catch (error) {
      set({ ordersLoading: false });
      return { success: false };
    }
  },

  updateOrderStatus: async (orderId, status, estimatedMinutes = null) => {
    try {
      const params = { status };
      if (estimatedMinutes) params.estimatedMinutes = estimatedMinutes;

      const response = await api.patch(`/orders/${orderId}/status`, null, { params });
      const updatedOrder = response.data || response;
      
      set((state) => ({
        activeOrders: updatedOrder.status === 'SERVED' || updatedOrder.status === 'CANCELLED'
          ? state.activeOrders.filter(o => o.id !== orderId)
          : state.activeOrders.map(o => o.id === orderId ? updatedOrder : o),
        readyOrders: updatedOrder.status === 'SERVED' || updatedOrder.status === 'CANCELLED'
          ? state.readyOrders.filter(o => o.id !== orderId)
          : state.readyOrders.map(o => o.id === orderId ? updatedOrder : o)
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update order status'
      };
    }
  },

  cancelOrder: async (orderId, reason) => {
    try {
      await api.post(`/orders/${orderId}/cancel`, null, {
        params: { reason }
      });
      set((state) => ({
        activeOrders: state.activeOrders.filter(o => o.id !== orderId),
        readyOrders: state.readyOrders.filter(o => o.id !== orderId)
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel order'
      };
    }
  },

  fetchMyOrders: async (silent = false) => {
    if (!silent) set({ myOrdersLoading: true });
    try {
      const response = await api.get('/orders/my');
      set({ 
        myOrders: Array.isArray(response) ? response : (response.data || []), 
        myOrdersLoading: false 
      });
    } catch (error) {
      set({ myOrdersLoading: false });
    }
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [
        { ...notification, id: Date.now(), read: false, timestamp: new Date() },
        ...state.notifications
      ].slice(0, 20) // Keep last 20
    }));
  },

  markNotificationsAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, read: true }))
    }));
  },

  // ===================== ADMIN: USER MANAGEMENT =====================
  fetchUsers: async () => {
    set({ usersLoading: true });
    try {
      const response = await api.get('/admin/users');
      set({ allUsers: Array.isArray(response) ? response : (response.data || []), usersLoading: false });
    } catch (error) {
      set({ usersLoading: false });
    }
  },

  updateUserRole: async (userId, role) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/role`, null, {
        params: { role }
      });
      const updatedUser = response.data || response;
      set((state) => ({
        allUsers: state.allUsers.map(u => u.id === userId ? updatedUser : u)
      }));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update role' };
    }
  },

  deleteUser: async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      set((state) => ({
        allUsers: state.allUsers.filter(u => u.id !== userId)
      }));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete user' };
    }
  },

  // ===================== ASSISTANCE ACTIONS =====================
  requestAssistance: async (reservationId, tableNumber) => {
    try {
      const response = await api.post('/orders/assistance', {
        reservationId,
        tableNumber,
      });
      return { success: true, message: response.message || 'Assistance requested' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to request assistance' };
    }
  },

  // ===================== STRIPE PAYMENT ACTIONS =====================
  createStripeCheckoutSession: async (reservationId, amount) => {
    try {
      const response = await api.post('/billing/stripe/create-checkout-session', {
        reservationId,
        amount,
        successUrl: `${window.location.origin}/payments/stripe-success?session_id={CHECKOUT_SESSION_ID}&reservation_id=${reservationId}`,
        cancelUrl: `${window.location.origin}/order-tracking/${reservationId}`,
      });
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to create Stripe session' };
    }
  },

  verifyStripePayment: async (sessionId, reservationId) => {
    try {
      const response = await api.post('/billing/stripe/verify', null, {
        params: { sessionId, reservationId },
      });
      return { success: true, data: response.data || response };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Payment verification failed' };
    }
  },
}));

export default useDataStore;
