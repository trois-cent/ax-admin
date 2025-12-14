import cookieConfig from '@/cookies.config'
import { login } from '@/requests/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const body = await request.json()

    const apiRes = await login(body.email, body.password)

    if (!apiRes.success || !apiRes.token || !apiRes.refreshToken) {
        return NextResponse.json(apiRes.error, { status: 401, statusText: apiRes.error })
    }

    console.log('Loging in...', apiRes.token)

    const response = NextResponse.json({ success: true })

    response.cookies.set({
        name: 'accessToken',
        value: apiRes.token,
        ...cookieConfig,
    })

    response.cookies.set({
        name: 'refreshToken',
        value: apiRes.refreshToken,
        ...cookieConfig,
    })

    return response
}
