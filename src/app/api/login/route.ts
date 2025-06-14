import { login } from '@/requests/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const body = await request.json()

    const apiRes = await login(body.email, body.password)

    if (!apiRes.success || !apiRes.token) {
        return NextResponse.json(apiRes.error, { status: 401, statusText: apiRes.error })
    }

    console.log('Loging in...', apiRes.token)

    const response = NextResponse.json({ success: true })

    response.cookies.set({
        name: 'accessToken',
        value: apiRes.token,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: '.athlete-x.io',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    })

    return response
}
