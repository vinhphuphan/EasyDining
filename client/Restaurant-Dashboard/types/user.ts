export interface User {
    id: number
    username: string
    email?: string | null
    avatar?: string | null
    shiftStart?: string | null
    shiftEnd?: string | null
    role: string
    createdAt?: string
    updatedAt?: string
}

// DTO Create/Update
export type UserPayload = {
    username: string
    email?: string | null
    pinCode?: string | null
    avatar?: string | null
    shiftStart?: string | null
    shiftEnd?: string | null
    role: string
}