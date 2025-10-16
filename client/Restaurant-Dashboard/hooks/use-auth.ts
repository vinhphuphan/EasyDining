import { useState, useEffect } from 'react'

interface User {
    id: string
    name: string
    role: string
    avatar: string
    shift: string
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check authentication from cookie
        const authCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('ed_auth='))

        if (authCookie) {
            // Fetch user data
            // TODO: Replace with actual API call
            setUser({
                id: "01011425",
                name: "Richardo Wilson",
                role: "Waiter",
                avatar: "/professional-man.jpg",
                shift: "10:00 AM - 12:00 PM"
            })
        }
        setIsLoading(false)
    }, [])

    const logout = () => {
        document.cookie = "ed_auth=; Max-Age=0; path=/"
        setUser(null)
    }

    return { user, isLoading, logout }
}