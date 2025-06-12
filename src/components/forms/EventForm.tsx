'use client'

import { FC, useState } from 'react'
import { SubmitErrorHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { DatePicker } from '../ui/date-picker'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

import { Combobox } from '../ui/combobox'
import { Label } from '../ui/label'
import { Dropdown } from '../ui/dropdown'
import { CityInput } from '../ui/city-input-wrapper'
import { fromCityToDBCity, fromGeoFeatureToCity } from '@/mappers'
import { optionalField } from '@/lib/utils'
import useSWR, { mutate } from 'swr'
import { createEvent, deleteEvent, toggleEventVisibility, updateEvent } from '@/requests/events'
import { ConfirmationButton } from '../ui/confirmation-button'
import { orgFetcher } from '@/requests/orgs'

type EventFormProps = {
    action: 'create' | 'update'
    defaultValues?: AXEvent
    closeModal?: () => void
}

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
        name: z.string().min(1, 'Name is required.'),
        description: optionalField(z.string().min(1, 'Description is required.')),
        startDate: z.date(),
        endDate: optionalField(z.date()), // add later than startDate validation
        location: citySchema,
        type: z.enum(['combine', 'training_camp', 'competition', 'tournament', 'showcase', 'other'], {
            required_error: 'Type is required.',
        }),
        organizationId: optionalField(z.string()),
        organizationName: optionalField(z.string()),
        websiteUrl: optionalField(z.string().url()),
        imageUrl: optionalField(z.string().url()),
    })
    .refine(data => data.organizationId || data.organizationName, {
        message: 'Select an organization or enter a name.',
        path: ['dingdong'],
    })
    .refine(data => data.startDate >= new Date(), {
        message: 'Start date must be in the future.',
        path: ['startDate'],
    })
    .refine(data => (data?.endDate ? data.endDate >= data.startDate : true), {
        message: 'End date must be after start date.',
        path: ['endDate'],
    })

export const EventForm: FC<EventFormProps> = ({ defaultValues: e, action, closeModal }) => {
    const { data: orgs, error: orgsError, isLoading } = useSWR<Organization[]>('/organizations', orgFetcher)

    const [orgIdOrNameError, setOrgIdOrNameError] = useState<string | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: e?.name || '',
            description: e?.description || '',
            type: e?.type || undefined,
            startDate: e?.startDate ? new Date(e.startDate) : undefined,
            endDate: e?.endDate ? new Date(e.endDate) : undefined,
            organizationId: e?.organizationId || '',
            organizationName: e?.organizationName || '',
            location: e?.location || undefined,
            websiteUrl: e?.websiteUrl || '',
            imageUrl: e?.imageUrl || '',
        },
    })

    const handleCityChange = (data: GeoJSON.Feature, onChange: (v: City) => void) => {
        const city = fromGeoFeatureToCity(data)
        onChange(city)
        console.log('City selected: ', city)
    }

    const resetOrgFields = () => {
        form.setValue('organizationId', '')
        form.setValue('organizationName', '')
    }

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setOrgIdOrNameError(null)

        const newEvent = {
            name: data.name,
            description: data?.description,
            type: data.type,
            startDate: data.startDate.toISOString(),
            endDate: data?.endDate ? data.endDate.toISOString() : undefined,
            organizationId: data?.organizationId,
            organizationName: data?.organizationName,
            location: fromCityToDBCity(data.location),
            websiteUrl: data?.websiteUrl,
            imageUrl: data?.imageUrl,
        }

        if (action === 'create') {
            createEvent(newEvent).then(res => {
                if (res.success) {
                    mutate('/events')
                    closeModal?.()
                } else {
                    console.error('Error creating organization:', res.error)
                }
            })
        } else if (action === 'update') {
            updateEvent(e?.id || '', newEvent).then(res => {
                if (res.success) {
                    mutate('/events')
                    closeModal?.()
                }
            })
        }
    }

    const handleToggleVisiblity = () => {
        if (!e) return
        toggleEventVisibility(e.id).then(res => {
            if (res.success) {
                mutate('/events')
                e.listed = !e.listed
            } else {
                console.error('Error toggling visibility:', res.error)
            }
        })
    }

    const handleNotValid: SubmitErrorHandler<z.infer<typeof formSchema>> = errors => {
        console.log('Form validation errors:', errors)
        // @ts-expect-error dingdong is a custom error path
        if (errors?.dingdong) {
            // @ts-expect-error dingdong is a custom error path
            setOrgIdOrNameError(errors.dingdong.message)
        } else {
            setOrgIdOrNameError(null)
        }
    }

    const handleDelete = (e: AXEvent) => {
        if (!e) return
        deleteEvent(e.id).then(res => {
            if (res.success) {
                mutate('/events')
                closeModal?.()
            } else {
                console.error('Error deleting event:', res.error)
            }
        })
    }

    return (
        <>
            {e ? (
                <div>
                    <h2>{e?.name}</h2>
                    <span className="text-sm uppercase">#{e?.id}</span>
                    <button
                        onClick={handleToggleVisiblity}
                        className={`badge cursor-pointer mt-4 ${e.listed ? 'green' : 'red'}`}
                    >
                        <span className={`h-1.5 w-1.5 rounded-full ${e.listed ? 'bg-green' : 'bg-red'}`} />
                        {e.listed ? 'Listed' : 'Unlisted'}
                    </button>
                </div>
            ) : (
                <h2>New Event</h2>
            )}
            <hr />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, handleNotValid)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Showcase your talent at the..." {...field} />
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
                                <FormLabel>Event Type</FormLabel>
                                <Dropdown
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={[
                                        { value: 'combine', label: 'Combine' },
                                        { value: 'training_camp', label: 'Training Camp' },
                                        { value: 'competition', label: 'Competition' },
                                        { value: 'tournament', label: 'Tournament' },
                                        { value: 'showcase', label: 'Showcase' },
                                        { value: 'other', label: 'Other' },
                                    ]}
                                    placeholder="Select an event type"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-grid-gap items-start">
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Starts on</FormLabel>
                                    <FormControl>
                                        <DatePicker value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ends on</FormLabel>
                                    <FormControl>
                                        <DatePicker value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Label>Organized By</Label>
                    <Tabs defaultValue={e?.organizationId ? 'known' : 'random'}>
                        <TabsList>
                            <TabsTrigger onClick={resetOrgFields} value="known">
                                Known
                            </TabsTrigger>
                            <TabsTrigger onClick={resetOrgFields} value="random">
                                Foreign
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="known">
                            <FormField
                                control={form.control}
                                name="organizationId"
                                render={({ field }) => (
                                    <FormItem>
                                        {orgsError ? (
                                            <div className="button full-width">
                                                <span className="text-red">Error loading organizations</span>
                                            </div>
                                        ) : isLoading ? (
                                            <div className="button full-width">
                                                <span className="text-gray">Loading organizations...</span>
                                            </div>
                                        ) : orgs && orgs?.length > 0 ? (
                                            <Combobox
                                                placeholder="Select an organization..."
                                                options={orgs.map(org => ({
                                                    value: org.id,
                                                    label: org.name,
                                                }))}
                                                value={field.value}
                                                onChange={value => {
                                                    field.onChange(value)
                                                    console.log(value)
                                                }}
                                            />
                                        ) : (
                                            <div className="button full-width">
                                                <span className="text-gray">
                                                    No organizations found. Create one to select it.
                                                </span>
                                            </div>
                                        )}
                                        <FormMessage>{orgIdOrNameError}</FormMessage>
                                    </FormItem>
                                )}
                            />
                        </TabsContent>
                        <TabsContent value="random">
                            <FormField
                                control={form.control}
                                name="organizationName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter the organization's name" {...field} />
                                        </FormControl>
                                        <FormMessage>{orgIdOrNameError}</FormMessage>
                                    </FormItem>
                                )}
                            />
                        </TabsContent>
                    </Tabs>
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
                    <FormField
                        control={form.control}
                        name="websiteUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Website Url</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image Url</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <button type="submit" className="button full-width rounded-sm active">
                        {action === 'update' ? 'Save' : 'Create Event'}
                    </button>
                </form>
            </Form>
            {e && (
                <>
                    <hr />
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="text-sm">
                                Created:{' '}
                                {new Date(e?.createdAt).toLocaleDateString('en-US', {
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
                                {new Date(e?.updatedAt).toLocaleDateString('en-US', {
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
                                onConfirm={() => handleDelete(e)}
                                confirmLabel="Delete"
                                cancelLabel="Cancel"
                                title="Delete this event?"
                                description="This action cannot be undone. This event will be permanently removed."
                            />
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
