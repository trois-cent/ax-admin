type CookieConfig = {
    httpOnly: boolean
    sameSite: 'lax' | 'strict' | 'none'
    secure: boolean
    domain?: string | undefined
    path: string
    maxAge?: number | undefined
}

const env = process.env.NEXT_PUBLIC_ENV

const prodConfig: CookieConfig = {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    domain: '.athlete-x.io',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
}

const devConfig: CookieConfig = {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
}

const cookieConfig: CookieConfig = env === 'prod' ? prodConfig : devConfig

export default cookieConfig
