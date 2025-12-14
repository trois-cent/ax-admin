export {}

declare global {
    type User = {
        id: string
        firstname: string
        lastname: string
        email: string
    }

    export type Organization = {
        // fixed properties
        id: string
        type: OrganizationType // set by Dan, not modifiable by manager
        name: string // set by Dan, not modifiable by manager

        // basic properties
        logoUrl?: string // URL to the logo
        description?: string // short description of the organisation
        websiteUrl?: string // URL to the organisation's website
        location?: City // physical address of the organisation

        // seats
        seats: OrganizationSeat[]

        // if of type school
        programs?: Program[]
        publicContacts?: SchoolContact[] // public contacts visible to athletes

        // timestamps
        createdAt: string
        updatedAt: string
    }

    export type OrganizationSeat = {
        id: string // unique identifier for the seat
        tools: string[] // list of tools the seat has access to. For now, only "radar" is supported
        user: {
            id: string // unique identifier for the user
            firstName: string // first name of the user
            lastName: string // last name of the user
        }

        // status
        active: boolean // whether the seat is active or not
        activatedAt: Date // date when the seat starts
        cancelledAt?: Date // date when the seat was cancelled, if applicable

        // optional properties
        createdAt?: Date // date when the seat was created
        updatedAt?: Date // date when the seat was last updated
    }

    export type Program = {
        id: string // unique identifier for the program
        name: string // name of the program
        description?: string // short description of the program
        url?: string // URL to the program's page
    }

    export type SchoolContact = {
        id: string // unique identifier for the contact
        name: string // name of the contact person
        email: string // email address of the contact person
        phone?: string // phone number of the contact person
        role?: string // role of the contact person within the school
        sports?: string // sports the contact is associated with
    }

    type OrganizationType = 'school' | 'club' | 'league' | 'business' | 'other'

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
