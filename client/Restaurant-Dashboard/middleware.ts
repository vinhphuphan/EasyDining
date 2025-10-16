import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const AUTH_COOKIE = 'ed_auth'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const isLoginRoute = pathname.startsWith('/login')
    const isRoot = pathname === '/'
    const isAuthenticated = request.cookies.get(AUTH_COOKIE)?.value === '1'

    // If user is authenticated and visits login, push them to dashboard
    if (isAuthenticated && (isLoginRoute || isRoot)) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    // If not authenticated and tries to access any protected page, redirect to login
    if (!isAuthenticated && !isLoginRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('redirect', pathname)
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

// Exclude Next internals, static assets, and API routes
export const config = {
    matcher: [
        '/((?!_next|.*\\..*|api).*)',
    ],
}


