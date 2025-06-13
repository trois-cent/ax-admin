import { NextRequest, NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
    exp: number
}

export function middleware(req: NextRequest) {
    console.log('Middleware triggered for:', req.nextUrl.pathname)

    const token = req.cookies.get('accessToken')?.value
    console.log('Access Token: ', token)
    const url = req.nextUrl.clone()

    // Allow public routes
    if (url.pathname.startsWith('/auth')) {
        console.log('Continuing to requested route: ', url.pathname)
        return NextResponse.next()
    }

    if (!token) {
        url.pathname = '/auth'
        console.log('No access token found, redirecting to /auth')
        return NextResponse.redirect(url)
    }

    try {
        const decoded = jwtDecode<JwtPayload>(token)
        if (decoded.exp * 1000 < Date.now()) {
            url.pathname = '/auth'
            console.log('Access token expired, redirecting to /auth')
            return NextResponse.redirect(url)
        }
    } catch {
        url.pathname = '/auth'
        console.log('Invalid access token, redirecting to /auth')
        return NextResponse.redirect(url)
    }

    console.log('Access token is valid, continuing to requested route: ', url.pathname)
    return NextResponse.next()
}

export const config = {
    matcher: [
        // Exclude Next.js static files and API routes
        // '/((?!_next|static|favicon.ico|auth).*)',
        '/((?!_next|static|favicon.ico|api|auth).*)',
    ],
}
