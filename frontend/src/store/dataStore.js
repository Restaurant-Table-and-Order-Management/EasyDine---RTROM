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
      set({ tables: response.data || [], tablesLoading: false });
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
        searchResults: response.data || [],
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
      set({ reservations: response.data || [], reservationsLoading: false });
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
      set({ reservations: response.data || [], reservationsLoading: false });
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
