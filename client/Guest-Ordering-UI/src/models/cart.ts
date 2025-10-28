export type Cart = {
    cartId: string
    items: CartItem[]
}

export type CartItem = {
    id: string
    menuItemId: number
    name: string
    price: number
    imageUrl: string
    category: string
    quantity: number
    note: string
}
