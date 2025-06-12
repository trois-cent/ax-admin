'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { login } from '@/requests/auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const formSchema = z.object({
    email: z.string().email('Invalid email address.'),
    password: z.string().min(8, 'Password must be at least 8 characters long.'),
})

export const AuthForm = () => {
    const router = useRouter()

    const [error, setError] = useState<string | null>(null)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        setError(null) // Reset error state on new submission

        const req = await login(data.email.toLowerCase(), data.password)

        if (req.success) router.push('/')
        else setError(req.error || 'Login failed. Please try again.')
    }

    const handleError = (errors: any) => {
        setError(errors.email?.message || errors.password?.message || 'An error occurred. Please try again.')
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit, handleError)} className="space-y-4">
                {error && <FormMessage>{error}</FormMessage>}
                <FormField
                    control={form.control}
                    name="email"
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
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <button type="submit" className="button full-width accent-hover">
                    Submit
                </button>
            </form>
        </Form>
    )
}
