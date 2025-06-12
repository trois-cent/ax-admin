import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import { refreshToken } from './auth'
import { redirect } from 'next/navigation'

export const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 15000,
    withCredentials: true,
})

export const rawApi: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 15000,
    withCredentials: true,
})

api.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            const request = error.config as AxiosRequestConfig

            const { success, error: e } = await refreshToken()

            if (success) {
                console.log('Token refreshed successfully, retrying request...')
                return rawApi(request)
            } else {
                console.error('Token refresh failed, redirecting to login...')
                console.error('Error details:', e)
                redirect('/auth')
            }
        }
        return Promise.reject(error)
    }
)
