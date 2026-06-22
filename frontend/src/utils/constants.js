export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  PACKAGES: {
    GET_ALL: '/packages',
    GET_ONE: (id) => \/packages/\\,
    CREATE: '/packages',
    UPDATE: (id) => \/packages/\\,
    DELETE: (id) => \/packages/\\,
  },
  BOOKINGS: {
    GET_ALL: '/bookings',
    GET_ONE: (id) => \/bookings/\\,
    CREATE: '/bookings',
    UPDATE: (id) => \/bookings/\\,
    CANCEL: (id) => \/bookings/\/cancel\,
  },
  USERS: {
    GET_PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
  },
  FEEDBACK: {
    GET_ALL: '/feedback',
    CREATE: '/feedback',
  },
};

export const BOOKING_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};
