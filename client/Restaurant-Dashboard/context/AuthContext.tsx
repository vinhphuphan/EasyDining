"use client"
interface User {
    id: string
    username: string
    avatar?: string
    role: string
    shiftStart?: string
    shiftEnd?: string
}

import { createContext, useContext, useEffect, useState } from "react"

export const AuthContext = createContext(null)

import { ReactNode } from "react"

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const stored = localStorage.getItem("user")
        if (stored) setUser(JSON.parse(stored))
    }, [])

    const login = (userData: User) => {
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("user")
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)