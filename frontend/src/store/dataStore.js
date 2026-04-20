import { create } from 'zustand';
import api from '../api/axiosConfig';

const useDataStore = create((set, get) => ({
  // Tables state
  tables: [],
  tablesLoading: false,
  selectedTable: null,

  // Reservations state
  reservations: [],
  reservationsLoading: false,

<<<<<<< HEAD
  // Menu state
  menuItems: [],
  menuLoading: false,

=======
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
  // Search state
  searchParams: {
    date: '',
    time: '',
    capacity: '',
  },
  searchResults: [],
  searchLoading: false,
  hasSearched: false,

  // Right panel state
  rightPanelContent: null, // 'booking' | 'details' | null

  // ===================== TABLE ACTIONS =====================

  fetchTables: async () => {
    set({ tablesLoading: true });
    try {
      const response = await api.get('/tables');
<<<<<<< HEAD
      set({ tables: Array.isArray(response) ? response : (response.data || []), tablesLoading: false });
=======
      set({ tables: response.data || [], tablesLoading: false });
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
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
<<<<<<< HEAD
        searchResults: Array.isArray(response) ? response : (response.data || []),
=======
        searchResults: response.data || [],
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
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

<<<<<<< HEAD
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

=======
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
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

  fetchMyReservations: async () => {
    set({ reservationsLoading: true });
    try {
      const response = await api.get('/reservations/my');
<<<<<<< HEAD
      set({ reservations: Array.isArray(response) ? response : (response.data || []), reservationsLoading: false });
=======
      set({ reservations: response.data || [], reservationsLoading: false });
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
    } catch (error) {
      set({ reservationsLoading: false });
    }
  },

  fetchAllReservations: async (date, status) => {
    set({ reservationsLoading: true });
    try {
      const params = {};
      if (date) params.date = date;
      if (status && status !== 'ALL') params.status = status;
      const response = await api.get('/reservations', { params });
<<<<<<< HEAD
      set({ reservations: Array.isArray(response) ? response : (response.data || []), reservationsLoading: false });
=======
      set({ reservations: response.data || [], reservationsLoading: false });
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
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

<<<<<<< HEAD
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

=======
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
  // ===================== UI ACTIONS =====================

  setRightPanelContent: (content) => set({ rightPanelContent: content }),

  clearSearch: () =>
    set({
      searchResults: [],
      hasSearched: false,
      searchParams: { date: '', time: '', capacity: '' },
    }),
}));

export default useDataStore;
