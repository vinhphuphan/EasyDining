'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import type { Order, Table } from '@/lib/mock-data'

interface AppState {
    orders: Order[]
    tables: Table[]
    notifications: Notification[]
    updateOrder: (id: string, updates: Partial<Order>) => void
    updateTable: (id: string, updates: Partial<Table>) => void
}

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([])
    const [tables, setTables] = useState<Table[]>([])

    const updateOrder = (id: string, updates: Partial<Order>) => {
        setOrders(prev =>
            prev.map(order => order.id === id ? { ...order, ...updates } : order)
        )
    }

    const updateTable = (id: string, updates: Partial<Table>) => {
        setTables(prev =>
            prev.map(table => table.id === id ? { ...table, ...updates } : table)
        )
    }

    return (
        <AppContext.Provider value={{
            orders,
            tables,
            notifications: [],
            updateOrder,
            updateTable
        }}>
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    const ctx = useContext(AppContext)
    if (!ctx) throw new Error('useApp must be used within AppProvider')
    return ctx
}