import { OrderDto } from "./order"

export interface TableDto {
    id: number
    name: string
    status: "Available" | "Occupied"
    tableCode: string
    seats: number
    orders?: OrderDto[]
}

export interface CreateTableDto {
    name: string
    seats: number
}

export interface OrderSummaryItemDto {
    orderId: number
    subtotal: number
    discount: number
    total: number
}

export interface TableCheckoutDto {
    tableId: number
    tableName: string
    tableCode: string
    ordersCount: number
    orders: OrderSummaryItemDto[]
    totalAmount: number
    checkoutTimeUtc?: string
}
