export interface Order {
    id: number
    tableId?: number
    tableName?: string
    tableCode: string
    buyerName: string
    buyerEmail: string
    buyerNote: string
    orderType?: string
    numberOfPeople?: number
    orderDate: string
    items: OrderItem[]
    subtotal: number
    discount: number
    orderTotal: number
    orderStatus: string
}

export interface OrderItem {
    id: number
    menuItemId: number
    name: string
    imageUrl: string
    price: number
    quantity: number
    note: string
}

export type CreateOrderItem = {
    menuItemId: number
    quantity: number
    note?: string
}

export type CreateOrderRequest = {
    tableCode: string
    orderType: "Dine In"
    numberOfPeople?: number
    buyerName?: string
    buyerEmail?: string
    buyerNote: string
    discount: number
    items: CreateOrderItem[]
}

export type ServiceResult<T> = {
    success: boolean
    message: string
    data: T
}