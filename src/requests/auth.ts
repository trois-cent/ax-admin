import { api, rawApi } from './http'

type LoginResult = { success: boolean; token?: string; refreshToken?: string; error?: string }

export const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
        const response = await rawApi.post('/auth/login/admin', { email, password })

        if (response.status === 200) {
            const token = response.data?.token
            const refreshToken = response.data?.refreshToken
            return { success: true, error: undefined, token, refreshToken }
        } else {
            return { success: false, error: response.data?.message || 'Login failed.' }
        }
    } catch (error: any) {
        console.error('Login error:', error)
        return { success: false, error: error?.response?.data?.message || 'Something went wrong. Try again later.' }
    }
}

export const refreshToken = async (): Promise<LoginResult> => {
    try {
        const response = await rawApi.post('/auth/refresh-admin-tokens')

        console.log('Refresh token response: ', response)

        if (response.status === 200) {
            console.log('Token refreshed successfully')
            return { success: true, error: undefined }
        } else {
            console.error('Token refresh failed with status ' + response.status + ':', response.data)
            return { success: false, error: response.data?.message || 'Token refresh failed.' }
        }
    } catch (error: any) {
        console.log('catch request: ', error)
        return { success: false, error: error?.response?.data?.message || 'Something went wrong. Try again later.' }
    }
}

export const userFetcher = (url: string) =>
    api.get(url).then(res => {
        const user = {
            id: res.data.id,
            firstname: res.data.firstName,
            lastname: res.data.lastName,
            email: res.data.email,
        }

        return user
    })
