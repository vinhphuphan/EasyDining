import { ORDER_STATUS, TABLE_STATUS } from './constants'

export type Role = 'admin' | 'manager' | 'waiter' | 'chef'

export interface User {
    id: string
    name: string
    email: string
    role: Role
    avatar?: string
    createdAt: string
    updatedAt: string
}

export interface MenuItem {
    id: string
    name: string
    description: string
    price: number
    category: string
    image?: string
    available: boolean
    createdAt: string
    updatedAt: string
}

export interface Table {
    id: string
    number: number
    capacity: number
    status: keyof typeof TABLE_STATUS
    reservedFor?: string
    updatedAt: string
}

export interface OrderItem {
    id: string
    menuItemId: string
    quantity: number
    notes?: string
    price: number
}

export interface Order {
    id: string
    tableId: string
    userId: string
    items: OrderItem[]
    status: keyof typeof ORDER_STATUS
    total: number
    notes?: string
    createdAt: string
    updatedAt: string
}

export interface ApiResponse<T> {
    data?: T
    error?: string
    message?: string
    status: number
}

// Form Types
export interface LoginFormData {
    email: string
    password: string
}

export interface CreateOrderFormData {
    tableId: string
    items: Array<{
        menuItemId: string
        quantity: number
        notes?: string
    }>
    notes?: string
}

export interface CreateTableFormData {
    number: number
    capacity: number
}

// Context Types
export interface AuthContextType {
    user: User | null
    login: (credentials: LoginFormData) => Promise<void>
    logout: () => Promise<void>
    loading: boolean
    error: string | null
}

export interface OrderContextType {
    orders: Order[]
    createOrder: (data: CreateOrderFormData) => Promise<void>
    updateOrder: (id: string, data: Partial<Order>) => Promise<void>
    deleteOrder: (id: string) => Promise<void>
    loading: boolean
    error: string | null
}