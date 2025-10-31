import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    const accessToken = req.cookies.get('accessToken')?.value
    const isAuthPage = pathname.startsWith('/login')

    // Chưa có token -> chỉ cho vào /login
    if (!accessToken && !isAuthPage) {
        const url = req.nextUrl.clone()
        url.pathname = '/login'
        url.search = '' // bỏ query để tránh loop
        return NextResponse.redirect(url)
    }

    // Đã có token -> chặn vào /login
    if (accessToken && isAuthPage) {
        const url = req.nextUrl.clone()
        url.pathname = '/dashboard'
        url.search = ''
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

// Loại trừ API và static assets
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
    ],
}
