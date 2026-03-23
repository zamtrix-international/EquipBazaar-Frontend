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

// Health Check
export const healthAPI = {
  check: () => api.get('/health'),
}

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
}

// User APIs
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAllUsers: (params) => api.get('/users', { params }),
}

// Equipment APIs
export const equipmentAPI = {
  getAll: (params) => api.get('/equipment', { params }),
  getById: (id) => api.get(`/equipment/${id}`),
  create: (data) => api.post('/equipment', data),
  update: (id, data) => api.put(`/equipment/${id}`, data),
  delete: (id) => api.delete(`/equipment/${id}`),
  getMyEquipment: () => api.get('/equipment/vendor/my-equipment'),
  getByVendor: (vendorId) => api.get(`/equipment/vendor/${vendorId}`),
  search: (params) => api.get('/equipment/search', { params }),
  getFeatured: (limit = 4) => api.get('/equipment/featured', { params: { limit } }),
  getCategories: () => api.get('/equipment/categories'),
  addImage: (id, data) => api.post(`/equipment/${id}/images`, data),
  getImages: (id) => api.get(`/equipment/${id}/images`),
  deleteImage: (id, imageId) => api.delete(`/equipment/${id}/images/${imageId}`),
  setAvailability: (id, data) => api.post(`/equipment/${id}/availability`, data),
  getAvailability: (id, params) => api.get(`/equipment/${id}/availability`, { params }),
}

// Vendor APIs
export const vendorAPI = {
  createProfile: (data) => api.post('/vendors', data),
  getProfile: (vendorId) => api.get(`/vendors/${vendorId}`),
  getMyProfile: () => api.get('/vendors/me'),
  updateProfile: (vendorId, data) => api.put(`/vendors/${vendorId}`, data),
  updateMyProfile: (data) => api.put('/vendors/me', data),
  uploadKYC: (vendorId, data) => api.post(`/vendors/${vendorId}/kyc`, data),
  uploadMyKYC: (data) => api.post('/vendors/me/kyc', data),
  addBankAccount: (vendorId, data) => api.post(`/vendors/${vendorId}/bank-account`, data),
  addMyBankAccount: (data) => api.post('/vendors/me/bank-account', data),
  getDashboard: () => api.get('/vendor/dashboard'),
  getEarnings: () => api.get('/vendor/earnings'),
  getEarningsSummary: () => api.get('/vendor/earnings/summary'),
  getEarningsTransactions: (params) => api.get('/vendor/earnings/transactions', { params }),
  search: (params) => api.get('/vendors/search', { params }),
}

// Booking APIs
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
  getMyBookings: (params) => api.get('/bookings/my-bookings', { params }),
  getVendorBookings: (params) => api.get('/bookings/vendor', { params }),
}

// Payment APIs
export const paymentAPI = {
  initiatePayment: (bookingId, data) => api.post(`/payments/${bookingId}/initiate`, data),
  verifyPayment: (paymentId, data) => api.post(`/payments/${paymentId}/verify`, data),
  getPaymentDetails: (paymentId) => api.get(`/payments/${paymentId}`),
}

// Delivery APIs
export const deliveryAPI = {
  confirmPickup: (bookingId, data) => api.post(`/delivery/${bookingId}/confirm-pickup`, data),
  confirmReturn: (bookingId, data) => api.post(`/delivery/${bookingId}/confirm-return`, data),
  getDeliveryStatus: (bookingId) => api.get(`/delivery/${bookingId}/status`),
}

// Dispute APIs
export const disputeAPI = {
  createDispute: (bookingId, data) => api.post(`/dispute/${bookingId}/dispute`, data),
  getDispute: (disputeId) => api.get(`/dispute/${disputeId}`),
  addMessage: (disputeId, data) => api.post(`/dispute/${disputeId}/message`, data),
  resolveDispute: (disputeId) => api.patch(`/dispute/${disputeId}/resolve`),
}

// Review APIs
export const reviewAPI = {
  createReview: (bookingId, data) => api.post(`/review/${bookingId}`, data),
  getEquipmentReviews: (equipmentId) => api.get(`/review/equipment/${equipmentId}`),
  getVendorReviews: (vendorId) => api.get(`/review/vendor/${vendorId}`),
}

// Wallet & Payout APIs
export const walletAPI = {
  getBalance: () => api.get('/wallet/balance'),
  getLedger: (params) => api.get('/wallet/ledger', { params }),
}

export const payoutAPI = {
  createWithdrawalRequest: (data) => api.post('/payouts/withdrawal-request', data),
  getWithdrawalRequest: (requestId) => api.get(`/payouts/withdrawal-request/${requestId}`),
  getPayouts: (params) => api.get('/payouts', { params }),
  processWithdrawal: (requestId) => api.patch(`/payouts/withdrawal-request/${requestId}/process`),
  getWithdrawalRequests: () => api.get('/payouts/withdrawal-request'),
}

// Commission APIs
export const commissionAPI = {
  getCommissionRule: () => api.get('/commission'),
  updateCommissionRule: (data) => api.put('/commission', data),
  calculateCommission: (bookingId) => api.post(`/commission/${bookingId}/calculate`),
}

// Report APIs
export const reportAPI = {
  generateBookingReport: (params) => api.get('/reports/booking', { params }),
  exportReport: (data) => api.post('/reports/export', data),
  getExportStatus: (exportId) => api.get(`/reports/export/${exportId}`),
  listVendorReports: (params) => api.get('/reports/list', { params }),
}

// Settings APIs
export const settingsAPI = {
  getPaymentGatewayConfig: () => api.get('/settings/payment-gateway'),
  updatePaymentGatewayConfig: (data) => api.put('/settings/payment-gateway', data),
  getAppSettings: () => api.get('/settings/app'),
  updateAppSetting: (data) => api.put('/settings/app', data),
}

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getApprovals: () => api.get('/admin/approvals'),
  getPendingKyc: () => api.get('/admin/kyc/pending'),
  reviewKyc: (kycId, data) => api.patch(`/admin/kyc/${kycId}/review`, data),
  getLogs: (params) => api.get('/admin/logs', { params }),
  getVendors: (params) => api.get('/admin/vendors', { params }),
  approveVendor: (vendorId) => api.put(`/admin/vendors/${vendorId}/approve`),
  getUsers: (params) => api.get('/admin/users', { params }),
  getReports: (type, params) => api.get(`/admin/reports/${type}`, { params }),
  exportReport: (type, params) => api.post(`/admin/reports/${type}/export`, params),
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
  getBookings: (params) => api.get('/admin/bookings', { params }),
  updateUserStatus: (userId, status) => api.put(`/admin/users/${userId}/status`, { status }),
  updateVendorStatus: (vendorId, status) => api.put(`/admin/vendors/${vendorId}/status`, { status }),
}

// Customer APIs
export const customerAPI = {
  getDashboard: () => api.get('/customer/dashboard'),
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