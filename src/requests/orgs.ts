import { fromDBCityToCity } from '@/mappers'
import { api } from './http'

type NoPayloadResponse = { success: boolean; error?: string }

type CreateUpdateOrgRequestBody = {
    name: string
    type: OrganizationType
}

export const orgFetcher = (url: string) =>
    api.get(url).then(res => {
        console.log(res.data.data)
        return res.data.data
    }).catch(error => {
        console.error('Error fetching organizations:', error)
        throw error
    })

export const updateOrganization = async (
    orgId: string,
    data: CreateUpdateOrgRequestBody
): Promise<NoPayloadResponse> => {
    try {
        const response = await api.patch(`/v2/organizations/update/locked/${orgId}`, data)

        if (response.status === 200) {
            return { success: true, error: undefined }
        } else {
            return { success: false, error: response.data?.error || 'Something went wrong. Try again.' }
        }
    } catch (error: any) {
        return { success: false, error: error?.response?.data?.message || 'Something went wrong. Try again later.' }
    }
}

export const createOrganization = async (data: CreateUpdateOrgRequestBody): Promise<NoPayloadResponse> => {
    try {
        const response = await api.post('/v2/organizations/new', data)

        if (response.status === 201) {
            return { success: true, error: undefined }
        } else {
            return { success: false, error: response.data?.error || 'Something went wrong. Try again.' }
        }
    } catch (error: any) {
        return { success: false, error: error?.response?.data?.message || 'Something went wrong. Try again later.' }
    }
}

export const deleteOrganization = async (orgId: string): Promise<NoPayloadResponse> => {
    try {
        const response = await api.delete(`/v2/organizations/delete/${orgId}`)

        if (response.status === 200) {
            return { success: true, error: undefined }
        } else {
            return { success: false, error: response.data?.error || 'Something went wrong. Try again.' }
        }
    } catch (error: any) {
        return { success: false, error: error?.response?.data?.message || 'Something went wrong. Try again later.' }
    }
}

export const inviteManager = async (invitation: any, lang: 'en' | 'fr'): Promise<NoPayloadResponse> => {
    try {
        const response = await api.post(`/v2/invitations/new?lang=${lang}`, invitation)

        console.log('---------------')
        console.log('Invite response:', response)
        console.log('---------------')

        if (response.status === 201) {
            return { success: true, error: undefined }
        } else {
            return { success: false, error: response.data?.error || 'Something went wrong. Try again.' }
        }
    } catch (error: any) {
        console.log('Error sending invitation:', error)
        return { success: false, error: error?.response?.data?.message || 'Something went wrong. Try again later.' }
    }
}
