const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api'

class ApiService {
    private async request<T>(
        endpoint: string,
        options?: RequestInit
    ): Promise<T> {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        })

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`)
        }

        return response.json()
    }

    // Orders
    async getOrders() {
        return this.request<Order[]>('/orders')
    }

    async createOrder(data: Partial<Order>) {
        return this.request<Order>('/orders', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    }

    async updateOrder(id: string, data: Partial<Order>) {
        return this.request<Order>(`/orders/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        })
    }

    // Tables
    async getTables() {
        return this.request<Table[]>('/tables')
    }

    async updateTable(id: string, data: Partial<Table>) {
        return this.request<Table>(`/tables/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        })
    }
}

export const api = new ApiService()