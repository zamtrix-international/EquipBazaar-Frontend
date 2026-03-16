export const EQUIPMENT_TYPES = {
  TRACTOR: 'Tractor',
  JCB: 'JCB',
  CRANE: 'Crane',
  DUMPER: 'Dumper'
}

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const USER_ROLES = {
  CUSTOMER: 'customer',
  VENDOR: 'vendor',
  ADMIN: 'admin'
}

export const PAYMENT_METHODS = {
  CASH: 'cash',
  ONLINE: 'online',
  CARD: 'card'
}

export const MEERUT_LOCATIONS = [
  'Meerut Cantt',
  'Modipuram',
  'Partapur',
  'Delhi Road',
  'Garh Road',
  'Roorkee Road',
  'Shastri Nagar',
  'Lalkurti',
  'Sardhana',
  'Kanker Khera'
]

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },
  EQUIPMENT: {
    BASE: '/equipment',
    SEARCH: '/equipment/search',
    CATEGORIES: '/equipment/categories'
  },
  BOOKINGS: {
    BASE: '/bookings',
    MY_BOOKINGS: '/bookings/my-bookings',
    CANCEL: (id) => `/bookings/${id}/cancel`
  },
  VENDOR: {
    DASHBOARD: '/vendor/dashboard',
    EARNINGS: '/vendor/earnings',
    KYC: '/vendor/kyc'
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    VENDORS: '/admin/vendors',
    USERS: '/admin/users',
    REPORTS: '/admin/reports'
  }
}