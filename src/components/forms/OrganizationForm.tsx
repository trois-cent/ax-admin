'use client'

import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { ArrayInput } from '../ui/array-input'
import { Field } from '../ui/field'
import { CityInput } from '../ui/city-input-wrapper'
import { fromCityToDBCity, fromGeoFeatureToCity } from '@/mappers'
import { Dropdown } from '../ui/dropdown'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    createOrganization,
    deleteOrganization,
    toggleOrganizationVisibility,
    updateOrganization,
} from '@/requests/orgs'
import { mutate } from 'swr'
import { optionalField } from '@/lib/utils'
import { ConfirmationButton } from '../ui/confirmation-button'

type OrganizationFormProps = {
    action: 'create' | 'update'
    defaultValues?: Organization
    closeModal?: () => void
}

const contactSchema = z.object({
    firstname: z.string().min(1, 'First name is required'),
    lastname: z.string().min(1, 'Last name is required'),
    email: z.string().email('Email must be a valid email address'),
    type: z.enum(['coach', 'scout', 'other']),
    phone: optionalField(z.string()),
    sport_en: optionalField(z.string()),
    sport_fr: optionalField(z.string()),
})

const citySchema = z.object(
    {
        mapboxId: z.string().min(1),
        shortname: z.string().min(1),
        longname: z.string().min(1),
        coordinates: z.object({
            lat: z.number(),
            lng: z.number(),
        }),
        bbox: z.array(z.number()).length(4),
        region: z.object({
            regionName: z.string().min(1),
            regionCode: z.string().min(1),
        }),
        country: z.object({
            countryName: z.string().min(1),
            countryCode: z.string().min(1),
        }),
    },
    { required_error: 'Location is required.' }
)

const formSchema = z
    .object({
        name: z.string().min(1, 'Name is required'),
        logoUrl: optionalField(z.string().url('Logo URL must be a valid URL')),
        websiteUrl: optionalField(z.string().url('Website URL must be a valid URL')),
        type: z.enum(['school', 'league', 'other']),
        schoolType: optionalField(z.enum(['secondary', 'prep_school', 'cegep', 'university', 'other'])),
        location: citySchema,
        contacts: z.array(contactSchema),
    })
    .refine(data => data.type !== 'school' || (data.type === 'school' && data?.schoolType), {
        message: 'School type is required when organization type is school.',
        path: ['schoolType'],
    })

export const OrganizationForm: FC<OrganizationFormProps> = ({ defaultValues: o, action, closeModal }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: o?.name || '',
            logoUrl: o?.logoUrl || '',
            websiteUrl: o?.websiteUrl || '',
            type: o?.type || 'school',
            schoolType: o?.schoolType || undefined,
            location: o?.location || undefined,
            contacts: o?.contacts || [],
        },
    })

    const values = form.watch()

    const handleCityChange = (data: GeoJSON.Feature, onChange: (v: City) => void) => {
        const city = fromGeoFeatureToCity(data)
        onChange(city)
        console.log('City selected: ', city)
    }

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        const newOrg = {
            name: data.name,
            logoUrl: data?.logoUrl,
            websiteUrl: data?.websiteUrl,
            type: data.type,
            schoolType: data?.schoolType,
            location: fromCityToDBCity(data.location),
            contacts: data.contacts || [],
        }

        if (action === 'create') {
            createOrganization(newOrg).then(res => {
                if (res.success) {
                    mutate('/organizations')
                    closeModal?.()
                } else {
                    console.error('Error creating organization:', res.error)
                }
            })
        } else if (action === 'update') {
            updateOrganization(o?.id || '', newOrg).then(res => {
                if (res.success) {
                    mutate('/organizations')
                    closeModal?.()
                }
            })
        }
    }

    const handleToggleVisiblity = () => {
        if (!o) return
        toggleOrganizationVisibility(o.id).then(res => {
            if (res.success) {
                mutate('/organizations')
                o.listed = !o.listed // Toggle the listed state locally
            } else {
                console.error('Error toggling visibility:', res.error)
            }
        })
    }

    const handleDelete = (o: Organization) => {
        if (!o) return
        deleteOrganization(o.id).then(res => {
            if (res.success) {
                mutate('/organizations')
                closeModal?.()
            } else {
                console.error('Error deleting organization:', res.error)
            }
        })
    }

    return (
        <>
            {o ? (
                <div>
                    <h2>{o?.name}</h2>
                    <span className="text-sm uppercase">#{o?.id}</span>
                    <button
                        onClick={handleToggleVisiblity}
                        className={`badge cursor-pointer mt-4 ${o.listed ? 'green' : 'red'}`}
                    >
                        <span className={`h-1.5 w-1.5 rounded-full ${o.listed ? 'bg-green' : 'bg-red'}`} />
                        {o.listed ? 'Listed' : 'Unlisted'}
                    </button>
                </div>
            ) : (
                <h2>New Organization</h2>
            )}
            <hr />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, e => console.log(e))} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="logoUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Logo URL</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="websiteUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Website URL</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Dropdown
                                    value={field.value}
                                    options={[
                                        { value: 'school', label: 'School' },
                                        { value: 'league', label: 'League' },
                                        { value: 'other', label: 'Other' },
                                    ]}
                                    onChange={field.onChange}
                                    placeholder="Select an organization type"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {values.type === 'school' && (
                        <FormField
                            control={form.control}
                            name="schoolType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>School Type</FormLabel>
                                    <Dropdown
                                        value={field.value}
                                        options={[
                                            { value: 'secondaire', label: 'Secondary' },
                                            { value: 'prep_school', label: 'Prep School' },
                                            { value: 'cegep', label: 'Cégep' },
                                            { value: 'university', label: 'University' },
                                            { value: 'other', label: 'Other' },
                                        ]}
                                        onChange={field.onChange}
                                        placeholder="Select school type"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <CityInput
                                        value={field.value?.longname || ''}
                                        onSelection={c => handleCityChange(c, field.onChange)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <ArrayInput
                        name="contacts"
                        label="Contacts"
                        unit="Contact"
                        renderItem={(_, index) => (
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <Field name={`contacts.${index}.firstname`} label="First Name" />
                                    <Field name={`contacts.${index}.lastname`} label="Last Name" />
                                    <Field name={`contacts.${index}.email`} label="Email" />
                                    <Field name={`contacts.${index}.phone`} label="Phone" />
                                </div>
                                <FormField
                                    control={form.control}
                                    name={`contacts.${index}.type`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role</FormLabel>
                                            <Dropdown
                                                small
                                                value={field.value}
                                                options={[
                                                    { value: 'coach', label: 'Coach' },
                                                    { value: 'scout', label: 'Scout' },
                                                    { value: 'other', label: 'Other' },
                                                ]}
                                                onChange={field.onChange}
                                                placeholder="Select a contact type"
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Field name={`contacts.${index}.sport_fr`} label="Sport (Français)" />
                                <Field name={`contacts.${index}.sport_en`} label="Sport (English)" />
                            </div>
                        )}
                        defaultObject={{
                            firstname: '',
                            lastname: '',
                            email: '',
                            type: '',
                            phone: '',
                            sport: '',
                        }}
                        titleMapper={values =>
                            values?.firstname ? `${values.firstname} ${values?.lastname || ''}`.trim() : undefined
                        }
                    />

                    <button type="submit" className="button full-width rounded-sm active">
                        {action === 'update' ? 'Save' : 'Create Organization'}
                    </button>
                </form>
            </Form>
            {o && (
                <>
                    <hr />
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="text-sm">
                                Created:{' '}
                                {new Date(o?.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true,
                                })}
                            </span>
                            <span className="text-sm mt-1">
                                Last modified:{' '}
                                {new Date(o?.updatedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true,
                                })}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <ConfirmationButton
                                buttonLabel="Delete"
                                onConfirm={() => handleDelete(o)}
                                confirmLabel="Delete"
                                cancelLabel="Cancel"
                                title="Delete this organization?"
                                description="This action cannot be undone. All associated events and data will be permanently removed."
                            />
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
