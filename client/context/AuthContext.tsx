'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { authApi } from '@/lib/api'
import { ERROR_MESSAGES, ROUTES } from '@/lib/constants'
import type { User, AuthContextType, LoginFormData } from '@/lib/types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('user')
            return stored ? JSON.parse(stored) : null
        }
        return null
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Tự động lấy user khi reload
    React.useEffect(() => {
        if (!user && typeof window !== 'undefined') {
            authApi.getMe().then(res => {
                if (res.data) {
                    setUser(res.data)
                    localStorage.setItem('user', JSON.stringify(res.data))
                }
            })
        }
    }, [])

    const login = useCallback(async (credentials: LoginFormData) => {
        try {
            setLoading(true)
            setError(null)
            const response = await authApi.login(credentials)
            if (response.error) {
                setError(response.error)
                toast.error(response.error)
                return
            }
            if (response.data?.user) {
                setUser(response.data.user)
                localStorage.setItem('user', JSON.stringify(response.data.user))
                toast.success('Login successful')
                router.push(ROUTES.DASHBOARD)
            }
        } catch (err: any) {
            setError(err?.message || ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS)
            toast.error(err?.message || ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS)
        } finally {
            setLoading(false)
        }
    }, [router])

    const logout = useCallback(async () => {
        try {
            setLoading(true)
            await authApi.logout()
            setUser(null)
            localStorage.removeItem('user')
            router.push(ROUTES.LOGIN)
            toast.success('Logged out successfully')
        } catch (err: any) {
            toast.error(err?.message || ERROR_MESSAGES.GENERAL)
        } finally {
            setLoading(false)
        }
    }, [router])

    const value = {
        user,
        login,
        logout,
        loading,
        error,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}