export type OrderStatus = 'Pending' | 'Preparing' | 'Served' | 'Paid' | 'Cancelled'

export interface OrderItemDto {
    id: number
    menuItemId: number
    name: string
    imageUrl: string
    price: number
    quantity: number
    note?: string
}

export interface OrderDto {
    id: number
    tableId?: number
    tableName?: string
    tableCode: string
    orderType: string
    numberOfPeople?: number
    buyerName: string
    buyerEmail: string
    orderDate: string
    items: OrderItemDto[]
    subtotal: number
    discount: number
    orderTotal: number
    orderStatus: string
    createdAt?: string
    updatedAt?: string
}

// Create Order
export interface CreateOrderItemRequest {
    menuItemId: number
    quantity: number
    note?: string
}

export interface CreateOrderRequest {
    tableCode?: string
    orderType?: 'Dine In' | 'Take Away' | string
    numberOfPeople?: number
    buyerName: string
    buyerEmail?: string
    discount?: number
    items: CreateOrderItemRequest[]
}

export type CreateOrderResponse = ServiceResult<OrderDto>

export interface PagedList<T> {
    items: T[]
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
}

export interface ServiceResult<T> {
    success: boolean
    message: string
    data: T
}

export interface GetOrdersParams {
    tableCode?: string
    status?: OrderStatus
    page?: number
    pageSize?: number
}

export interface UpdateOrderStatusDto {
    orderId: number
    status: OrderStatus | string
}
