export interface MenuItem {
    id: number
    name: string
    price: number
    description?: string
    imageUrl?: string
    category?: string
    isAvailable: boolean
    isBest?: boolean
    isVeg?: boolean
    isSpicy?: boolean
}
