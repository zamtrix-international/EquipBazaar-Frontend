import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
}

// Equipment APIs
export const equipmentAPI = {
  getAll: (params) => api.get('/equipment', { params }),
  getById: (id) => api.get(`/equipment/${id}`),
  create: (data) => api.post('/equipment', data),
  update: (id, data) => api.put(`/equipment/${id}`, data),
  delete: (id) => api.delete(`/equipment/${id}`),
  getByVendor: (vendorId) => api.get(`/equipment/vendor/${vendorId}`),
  getMyEquipment: () => api.get('/equipment/vendor/my-equipment'),
  search: (params) => api.get('/equipment/search', { params }),
  getFeatured: (limit = 4) => api.get('/equipment/featured', { params: { limit } }),
  getCategories: () => api.get('/equipment/categories'),
  addImage: (id, data) => api.post(`/equipment/${id}/images`, data),
  deleteImage: (id, imageId) => api.delete(`/equipment/${id}/images/${imageId}`),
  setAvailability: (id, data) => api.post(`/equipment/${id}/availability`, data),
  getAvailability: (id, params) => api.get(`/equipment/${id}/availability`, { params }),
  getReviews: (id) => api.get(`/equipment/${id}/reviews`),
  addReview: (id, data) => api.post(`/equipment/${id}/reviews`, data),
}

// Booking APIs
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: (params) => api.get('/bookings/my-bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  accept: (id) => api.post(`/bookings/${id}/accept`),
  reject: (id) => api.post(`/bookings/${id}/reject`),
  confirmPickup: (id) => api.post(`/bookings/${id}/confirm-pickup`),
  confirmDelivery: (id) => api.post(`/bookings/${id}/confirm-delivery`),
  getAvailable: (params) => api.get('/bookings/available', { params }),
  getAnalytics: () => api.get('/bookings/analytics'),
  getTimeline: (id) => api.get(`/bookings/${id}/timeline`),
  createOrder: (data) => api.post('/payments/create-order', data),
  verifyPayment: (data) => api.post('/payments/verify', data),
}

// Vendor APIs
export const vendorAPI = {
  getDashboard: () => api.get('/vendor/dashboard'),
  getEarnings: () => api.get('/vendor/earnings'),
  getEarningsSummary: () => api.get('/vendor/earnings/summary'),
  getEarningsTransactions: (params) => api.get('/vendor/earnings/transactions', { params }),
  updateAvailability: (equipmentId, status) => 
    api.put(`/vendor/equipment/${equipmentId}/availability`, { status }),
  uploadKYC: (data) => api.post('/vendor/kyc', data),
  getKycStatus: () => api.get('/vendor/kyc/status'),
  submitKyc: (data) => api.post('/vendor/kyc/submit', data),
  getProfile: (vendorId) => api.get(`/vendors/${vendorId}`),
  updateProfile: (vendorId, data) => api.put(`/vendors/${vendorId}`, data),
  addBankAccount: (vendorId, data) => api.post(`/vendors/${vendorId}/bank-account`, data),
  getBankAccounts: (vendorId) => api.get(`/vendors/${vendorId}/bank-account`),
  deleteBankAccount: (vendorId, accountId) => api.delete(`/vendors/${vendorId}/bank-account/${accountId}`),
  search: (params) => api.get('/vendors/search', { params }),
}

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getVendors: (params) => api.get('/admin/vendors', { params }),
  approveVendor: (vendorId) => api.put(`/admin/vendors/${vendorId}/approve`),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateCommission: (data) => api.put('/admin/commission', data),
  getCommissionRules: () => api.get('/admin/commission/rules'),
  updateCommissionRules: (data) => api.put('/admin/commission/rules', data),
  getReports: (type, params) => api.get(`/admin/reports/${type}`, { params }),
  getBookings: (params) => api.get('/admin/bookings', { params }),
  updateUserStatus: (userId, status) => api.put(`/admin/users/${userId}/status`, { status }),
  updateVendorStatus: (vendorId, status) => api.put(`/admin/vendors/${vendorId}/status`, { status }),
}

// Customer APIs
export const customerAPI = {
  getDashboard: () => api.get('/customer/dashboard'),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
}

// Support APIs
export const supportAPI = {
  getMyTickets: () => api.get('/support/tickets'),
  createTicket: (data) => api.post('/support/tickets', data),
  getTicketById: (id) => api.get(`/support/tickets/${id}`),
  sendMessage: (ticketId, data) => api.post(`/support/tickets/${ticketId}/messages`, data),
  closeTicket: (id) => api.put(`/support/tickets/${id}/close`),
}

// Notification APIs
export const notificationAPI = {
  getMyNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
}