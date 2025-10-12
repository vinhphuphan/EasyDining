export const APP_NAME = 'EasyDining'

export const ORDER_STATUS = {
    IN_PROGRESS: 'in-progress',
    READY: 'ready',
    WAITING_PAYMENT: 'waiting-payment',
    COMPLETED: 'completed',
} as const

export const TABLE_STATUS = {
    AVAILABLE: 'available',
    OCCUPIED: 'occupied',
    RESERVED: 'reserved',
} as const

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    ORDERS: '/order',
    TABLES: '/table',
    MENU: '/menu',
    HISTORY: '/history',
} as const

export const COLORS = {
    STATUS: {
        [ORDER_STATUS.IN_PROGRESS]: 'text-orange-600',
        [ORDER_STATUS.READY]: 'text-green-600',
        [ORDER_STATUS.WAITING_PAYMENT]: 'text-blue-600',
        [ORDER_STATUS.COMPLETED]: 'text-gray-600',
    }
}