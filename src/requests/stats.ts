import { api } from './http'

export const statsFetcher = (url: string) => api.get(url, { withCredentials: true }).then(res => res.data)
