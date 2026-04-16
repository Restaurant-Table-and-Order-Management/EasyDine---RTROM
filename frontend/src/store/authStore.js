import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,

  login: (user, token) => {
    set({
      isAuthenticated: true,
      user,
      token,
    })
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  },

  logout: () => {
    set({
      isAuthenticated: false,
      user: null,
      token: null,
    })
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  restoreSession: () => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (token && user) {
      set({
        isAuthenticated: true,
        user: JSON.parse(user),
        token,
      })
    }
  },
}))
