export interface MenuItem {
    id: string
    name: string
    price: number
    description?: string
    imageUrl: string
    category?: string
    isAvailable: boolean,
    isBest?: boolean
    isVeg?: boolean
    isSpicy?: boolean
}
