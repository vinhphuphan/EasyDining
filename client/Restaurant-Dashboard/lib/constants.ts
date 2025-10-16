export const APP_NAME = 'EasyDining'
export const APP_DESCRIPTION = 'Cloud-based restaurant management system to simplify your work'

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    ORDERS: '/order',
    TABLES: '/table',
    MENU: '/menu',
    HISTORY: '/history',
} as const

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        ME: '/auth/me',
    },
    ORDERS: {
        LIST: '/orders',
        CREATE: '/orders',
        UPDATE: '/orders/:id',
        DELETE: '/orders/:id',
    },
    TABLES: {
        LIST: '/tables',
        CREATE: '/tables',
        UPDATE: '/tables/:id',
        DELETE: '/tables/:id',
    },
    MENU: {
        LIST: '/menu',
        CREATE: '/menu',
        UPDATE: '/menu/:id',
        DELETE: '/menu/:id',
    },
} as const

export const ORDER_STATUS = {
    IN_PROGRESS: 'in-progress',
    READY: 'ready',
    WAITING_PAYMENT: 'waiting-payment',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
} as const

export const TABLE_STATUS = {
    AVAILABLE: 'available',
    OCCUPIED: 'occupied',
    RESERVED: 'reserved',
    CLEANING: 'cleaning',
} as const

export const ERROR_MESSAGES = {
    GENERAL: 'Something went wrong. Please try again.',
    AUTH: {
        INVALID_CREDENTIALS: 'Invalid email or password',
        SESSION_EXPIRED: 'Your session has expired. Please login again.',
    },
    ORDERS: {
        CREATE_FAILED: 'Failed to create order',
        UPDATE_FAILED: 'Failed to update order',
        DELETE_FAILED: 'Failed to delete order',
    },
} as const

export const VALIDATION = {
    MIN_PASSWORD_LENGTH: 8,
    MAX_NAME_LENGTH: 50,
    PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
} as const

export const COLORS = {
    STATUS: {
        [ORDER_STATUS.IN_PROGRESS]: 'text-orange-600',
        [ORDER_STATUS.READY]: 'text-green-600',
        [ORDER_STATUS.WAITING_PAYMENT]: 'text-blue-600',
        [ORDER_STATUS.COMPLETED]: 'text-gray-600',
        [ORDER_STATUS.CANCELLED]: 'text-red-600',
    },
}