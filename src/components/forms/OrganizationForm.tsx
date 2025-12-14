'use client'

import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Dropdown } from '../ui/dropdown'
import { zodResolver } from '@hookform/resolvers/zod'
import { createOrganization, deleteOrganization, updateOrganization } from '@/requests/orgs'
import { mutate } from 'swr'
import { ConfirmationButton } from '../ui/confirmation-button'
import { Plus } from 'lucide-react'

type OrganizationFormProps = {
    action: 'create' | 'update'
    defaultValues?: Organization
    openInviteModal?: (organizationId: string, organizationName: string) => void
    closeModal?: () => void
}

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.enum(['school', 'club', 'league', 'business', 'other']),
})

export const OrganizationForm: FC<OrganizationFormProps> = ({
    defaultValues: o,
    action,
    closeModal,
    openInviteModal,
}) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: o?.name || '',
            type: o?.type || 'other',
        },
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        const newOrg = {
            name: data.name,
            type: data.type,
        }

        if (action === 'create') {
            createOrganization(newOrg).then(res => {
                if (res.success) {
                    mutate('/v2/organizations/all')
                    closeModal?.()
                } else {
                    console.error('Error creating organization:', res.error)
                }
            })
        } else if (action === 'update') {
            updateOrganization(o?.id || '', newOrg).then(res => {
                if (res.success) {
                    mutate('/v2/organizations/all')
                    closeModal?.()
                } else {
                    alert(res.error || 'Error updating organization')
                }
            })
        }
    }

    const handleInvite = () => {
        closeModal?.()
        openInviteModal?.(o?.id || '', o?.name || '')
    }

    const handleDelete = (o: Organization) => {
        if (!o) return
        deleteOrganization(o.id).then(res => {
            if (res.success) {
                mutate('/v2/organizations/all')
                closeModal?.()
            } else {
                console.error('Error deleting organization:', res.error)
                alert(res.error || 'Error deleting organization')
            }
        })
    }

    return (
        <>
            {o ? (
                <div>
                    <h2>{o?.name}</h2>
                    <span className="text-sm uppercase">#{o?.id}</span>
                    <button onClick={handleInvite} className={`badge cursor-pointer mt-4 green`}>
                        {/* <span className={`h-1.5 w-1.5 rounded-full ${o.listed ? 'bg-green' : 'bg-red'}`} /> */}
                        <Plus size={12} />
                        Invite a manager
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
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <FormControl>
                                    <Dropdown
                                        value={field.value}
                                        options={[
                                            { value: 'school', label: 'School' },
                                            { value: 'club', label: 'Club' },
                                            { value: 'league', label: 'League' },
                                            { value: 'business', label: 'Business' },
                                            { value: 'other', label: 'Other' },
                                        ]}
                                        onChange={field.onChange}
                                        placeholder="Select an organization type"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
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
