"use client"

import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedLayout({
    children
}: {
    children: React.ReactNode
}) {
    const { isAuthenticated } = useSelector((state: any) => state.auth)
    const router = useRouter()

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login')
        }
    }, [isAuthenticated, router])

    if (!isAuthenticated) {
        return null
    }

    return <>{children}</>
}