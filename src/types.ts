export {}

declare global {
    type User = {
        id: string
        firstname: string
        lastname: string
        email: string
    }

    type Organization = {
        id: string
        createdAt: string
        updatedAt: string
        listed: boolean

        name: string
        type: OrganizationType
        schoolType?: SchoolType
        location: City
        logoUrl?: string
        websiteUrl?: string
        contacts: Contact[]
    }

    type OrganizationType = 'school' | 'league' | 'other'

    type SchoolType = 'secondary' | 'prep_school' | 'cegep' | 'university' | 'other'

    type Contact = {
        firstname: string
        lastname: string
        email: string
        phone?: string
        type: 'coach' | 'scout' | 'other'
        sport_en?: string
        sport_fr?: string
    }

    type AXEvent = {
        id: string
        createdAt: string
        updatedAt: string
        listed: boolean

        name: string
        description: string
        type: AXEventType
        startDate: string
        endDate?: string
        location: City
        // either known or foreign organization
        organizationId?: string
        organizationName?: string
        websiteUrl?: string
        imageUrl?: string
    }

    type AXEventType = 'combine' | 'training_camp' | 'competition' | 'tournament' | 'showcase' | 'other'

    type City = {
        mapboxId: string
        // full name to display
        shortname: string
        longname: string
        // longitude and latitude
        coordinates: {
            lat: number
            lng: number
        }
        // bounding box (city range)
        bbox: number[]
        region: {
            // region name
            regionName: string
            // region code (BC, AB, etc.)
            regionCode: string
        }
        country: {
            // country name
            countryName: string
            // country code (CA, US, etc.)
            countryCode: string
        }
    }

    type DBCity = {
        mapboxId: string
        shortname: string
        longname: string
        latitude: number
        longitude: number
        bbox: number[]
        regionName: string
        regionCode: string
        countryName: string
        countryCode: string
    }

    type Stats = {
        userCount: number
        subscribedUserCount: number
        organizationCount: number
        eventCount: number
        completedIdentityCount: number
        totalContactCount: number
    }
}
