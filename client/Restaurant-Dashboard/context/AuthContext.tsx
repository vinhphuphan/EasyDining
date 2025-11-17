"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from "react"

interface User {
    id: number
    username: string
    avatar?: string
    role: string
    shiftStart?: string
    shiftEnd?: string
}

type AuthContextType = {
    user: User | null
    login: (userData: User) => void
    logout: () => void
    updateUser: (updated: User) => void
}

// create a context that can be null until provided
export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        if (typeof window === "undefined") return
        const stored = localStorage.getItem("user")
        if (stored) setUser(JSON.parse(stored))
    }, [])

    const login = (userData: User) => {
        setUser(userData)
        if (typeof window !== "undefined") localStorage.setItem("user", JSON.stringify(userData))
    }

    const logout = () => {
        setUser(null)
        if (typeof window !== "undefined") localStorage.removeItem("user")
    }

    const updateUser = (updated: User) => {
        setUser(updated)
        if (typeof window !== "undefined") localStorage.setItem("user", JSON.stringify(updated))
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}

// strict hook that ensures the context is available
export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
    return ctx
}