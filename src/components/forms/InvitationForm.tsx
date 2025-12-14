'use client'

import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { inviteManager } from '@/requests/orgs'
import { Dropdown } from '../ui/dropdown'

type InvitationFormProps = {
    organizationId: string
    organizationName: string
    closeModal?: () => void
}

const formSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    lang: z.enum(['en', 'fr'], { required_error: 'Language is required' }),
})

export const InvitationForm: FC<InvitationFormProps> = ({ organizationId, organizationName, closeModal }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const invitation = {
            type: 'manager',
            createdBy: {
                id: 'admin',
                email: 'team@athlete-x.io',
            },
            invitee: {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
            },
            resourceId: organizationId,
        }

        const result = await inviteManager(invitation, data.lang)

        if (result.success) {
            alert('Invitation sent!')
            closeModal?.()
        } else {
            alert('Error sending invitation: ' + result?.error)
        }
    }

    return (
        <>
            <div>
                <h2 className="mb-4">Create Invitation</h2>
                <p>
                    Invite a someone to join{' '}
                    <span className="text-black" style={{ display: 'inline' }}>
                        {organizationName}
                    </span>{' '}
                    as a manager. They will receive an email allowing them to accept the invitation and create their
                    account.
                </p>
            </div>
            <hr />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, e => console.log(e))} className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lang"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Language</FormLabel>
                                <Dropdown
                                    value={field.value}
                                    options={[
                                        { value: 'en', label: 'English' },
                                        { value: 'fr', label: 'French' },
                                    ]}
                                    onChange={field.onChange}
                                    placeholder="Select email language"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <button type="submit" className="mt-8 button full-width rounded-sm active">
                        Send Invitation
                    </button>
                </form>
            </Form>
        </>
    )
}
