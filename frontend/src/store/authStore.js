import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axiosConfig';
import { ROLE_REDIRECT } from '../utils/constants';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { token, ...user } = response.data;
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return { success: true, user };
        } catch (error) {
          const message =
            error.response?.data?.message || 'Login failed. Please try again.';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      signup: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/signup', { name, email, password });
          const { token, ...user } = response.data;
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return { success: true, user };
        } catch (error) {
          const message =
            error.response?.data?.message || 'Signup failed. Please try again.';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),

      getRole: () => get().user?.role || 'CUSTOMER',
      isAdmin: () => get().user?.role === 'ADMIN',
      isStaff: () => get().user?.role === 'STAFF',
      isCustomer: () => get().user?.role === 'CUSTOMER',

      getRoleRedirect: () => {
        const role = get().user?.role || 'CUSTOMER';
        return ROLE_REDIRECT[role] || '/dashboard';
      },
    }),
    {
      name: 'easydine-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
