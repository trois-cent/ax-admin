import { fromDBCityToCity } from '@/mappers'
import { api } from './http'

type NoPayloadResponse = { success: boolean; error?: string }

type CreateUpdateEventRequestBody = {
    name: string
    description?: string | undefined
    type: AXEventType
    startDate: string
    endDate?: string | undefined
    location: DBCity
    organizationId?: string | undefined
    organizationName?: string | undefined
    websiteUrl?: string | undefined
    imageUrl?: string | undefined
}

export const eventFetcher = (url: string) =>
    api.get(url).then(res => res.data.map((e: any) => ({ ...e, location: fromDBCityToCity(e.location) })))

export const updateEvent = async (eventId: string, data: CreateUpdateEventRequestBody): Promise<NoPayloadResponse> => {
    try {
        const response = await api.put(`/events/update/${eventId}`, data)

        if (response.status === 200) {
            return { success: true, error: undefined }
        } else {
            return { success: false, error: response.data?.error || 'Something went wrong. Try again.' }
        }
    } catch (error: any) {
        return { success: false, error: error?.response?.data?.message || 'Something went wrong. Try again later.' }
    }
}

export const createEvent = async (data: CreateUpdateEventRequestBody): Promise<NoPayloadResponse> => {
    try {
        const response = await api.post('/events', data)

        if (response.status === 201) {
            return { success: true, error: undefined }
        } else {
            return { success: false, error: response.data?.error || 'Something went wrong. Try again.' }
        }
    } catch (error: any) {
        return { success: false, error: error?.response?.data?.message || 'Something went wrong. Try again later.' }
    }
}

export const toggleEventVisibility = async (eventId: string): Promise<NoPayloadResponse> => {
    try {
        const response = await api.post(`/events/visibility/${eventId}`)
        if (response.status === 200) {
            return { success: true, error: undefined }
        } else {
            return { success: false, error: response.data?.error || 'Something went wrong. Try again.' }
        }
    } catch (error: any) {
        return { success: false, error: error?.response?.data?.message || 'Something went wrong. Try again later.' }
    }
}

export const deleteEvent = async (eventId: string): Promise<NoPayloadResponse> => {
    try {
        const response = await api.delete(`/events/delete/${eventId}`)

        if (response.status === 200) {
            return { success: true, error: undefined }
        } else {
            return { success: false, error: response.data?.error || 'Something went wrong. Try again.' }
        }
    } catch (error: any) {
        return { success: false, error: error?.response?.data?.message || 'Something went wrong. Try again later.' }
    }
}
