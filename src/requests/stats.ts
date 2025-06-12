import { api } from './http'

export const statsFetcher = (url: string) => api.get(url).then(res => res.data)
