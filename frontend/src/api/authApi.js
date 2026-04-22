import apiClient from './client'

export const authApi = {
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),

  register: (name, email, password, role) =>
    apiClient.post('/auth/signup', { name, email, password, role }),

  refreshToken: () =>
    apiClient.post('/auth/refresh'),

  logout: () =>
    apiClient.post('/auth/logout'),

  forgotPassword: (email) =>
    apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (token, newPassword) =>
    apiClient.post('/auth/reset-password', { token, newPassword }),
}
