import { API_ENDPOINTS } from './constants'
import type { ApiResponse, LoginFormData, CreateOrderFormData, Order, Table, MenuItem, User } from './types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            credentials: 'include',
        })
        const data = await res.json()
        return {
            data: data.data,
            error: data.error,
            message: data.message,
            status: res.status,
        }
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : 'Network error',
            status: 500,
        }
    }
}

export const authApi = {
    login: (credentials: LoginFormData) =>
        fetchApi<{ user: User; token: string }>(API_ENDPOINTS.AUTH.LOGIN, {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),
    logout: () =>
        fetchApi(API_ENDPOINTS.AUTH.LOGOUT, {
            method: 'POST',
        }),
    getMe: () =>
        fetchApi<User>(API_ENDPOINTS.AUTH.ME),
}

export const ordersApi = {
    list: () => fetchApi<Order[]>(API_ENDPOINTS.ORDERS.LIST),
    create: (data: CreateOrderFormData) =>
        fetchApi<Order>(API_ENDPOINTS.ORDERS.CREATE, {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: string, data: Partial<Order>) =>
        fetchApi<Order>(API_ENDPOINTS.ORDERS.UPDATE.replace(':id', id), {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
    delete: (id: string) =>
        fetchApi(API_ENDPOINTS.ORDERS.DELETE.replace(':id', id), {
            method: 'DELETE',
        }),
}

export const tablesApi = {
    list: () => fetchApi<Table[]>(API_ENDPOINTS.TABLES.LIST),
    create: (data: Table) =>
        fetchApi<Table>(API_ENDPOINTS.TABLES.CREATE, {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: string, data: Partial<Table>) =>
        fetchApi<Table>(API_ENDPOINTS.TABLES.UPDATE.replace(':id', id), {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
    delete: (id: string) =>
        fetchApi(API_ENDPOINTS.TABLES.DELETE.replace(':id', id), {
            method: 'DELETE',
        }),
}

export const menuApi = {
    list: () => fetchApi<MenuItem[]>(API_ENDPOINTS.MENU.LIST),
    create: (data: MenuItem) =>
        fetchApi<MenuItem>(API_ENDPOINTS.MENU.CREATE, {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: string, data: Partial<MenuItem>) =>
        fetchApi<MenuItem>(API_ENDPOINTS.MENU.UPDATE.replace(':id', id), {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
    delete: (id: string) =>
        fetchApi(API_ENDPOINTS.MENU.DELETE.replace(':id', id), {
            method: 'DELETE',
        }),
}