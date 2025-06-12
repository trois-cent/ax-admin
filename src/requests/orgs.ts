import { fromDBCityToCity } from '@/mappers'
import { api } from './http'

type NoPayloadResponse = { success: boolean; error?: string }

type CreateUpdateOrgRequestBody = {
    name: string
    description?: string | undefined
    type: OrganizationType
    schoolType?: SchoolType | undefined
    location: DBCity
    logoUrl?: string | undefined
    websiteUrl?: string | undefined
    contacts: Contact[]
}

export const orgFetcher = (url: string) =>
    api.get(url).then(res => res.data.map((o: any) => ({ ...o, location: fromDBCityToCity(o.location) })))

export const updateOrganization = async (
    orgId: string,
    data: CreateUpdateOrgRequestBody
): Promise<NoPayloadResponse> => {
    try {
        const response = await api.put(`/organizations/update/${orgId}`, data)

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
        const response = await api.post('/organizations', data)

        if (response.status === 201) {
            return { success: true, error: undefined }
        } else {
            return { success: false, error: response.data?.error || 'Something went wrong. Try again.' }
        }
    } catch (error: any) {
        return { success: false, error: error?.response?.data?.message || 'Something went wrong. Try again later.' }
    }
}

export const toggleOrganizationVisibility = async (orgId: string): Promise<NoPayloadResponse> => {
    try {
        const response = await api.post(`/organizations/visibility/${orgId}`)
        if (response.status === 200) {
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
        const response = await api.delete(`/organizations/delete/${orgId}`)

        if (response.status === 200) {
            return { success: true, error: undefined }
        } else {
            return { success: false, error: response.data?.error || 'Something went wrong. Try again.' }
        }
    } catch (error: any) {
        return { success: false, error: error?.response?.data?.message || 'Something went wrong. Try again later.' }
    }
}
