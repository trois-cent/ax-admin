'use client'

import { Dropdown } from '@/components/ui/dropdown'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { api } from '@/requests/http'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

const METHODS = ['post', 'get', 'put', 'patch', 'delete'] as const
type Method = (typeof METHODS)[number]

const Commands = () => {
    const [pwd, setPwd] = useState<string>('')
    const [endpoint, setEndpoint] = useState<string>('')
    const [method, setMethod] = useState<'post' | 'get' | 'put' | 'patch' | 'delete'>('post')
    const [loading, setLoading] = useState<boolean>(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await api[method](endpoint)

            if (response.status < 300) {
                console.log('Success: ', JSON.stringify(response.data))
                alert('Command triggered successfully: ' + JSON.stringify(response?.data))
            } else {
                console.log('Failed: ', response.statusText)
                alert('Failed to trigger command: ' + response?.statusText)
            }
        } catch (error) {
            console.log('Error triggering command: ', error)
            alert('Error triggering command:' + JSON.stringify(error))
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="w-full h-full flex flex-1 flex-col items-center justify-center">
            <div className="w-[500px] flex flex-col gap-6">
                {pwd !== 'bingbong' ? (
                    <>
                        <h1>Commands</h1>
                        <p>This page is protected. Enter the password to continue.</p>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                name="password"
                                id="password"
                                type="password"
                                value={pwd}
                                onChange={e => setPwd(e.target.value)}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <h1>Commands</h1>
                        <p>Enter the API endpoint to send a command to:</p>
                        <div className="space-y-2">
                            <Label htmlFor="endpoint">API Endpoint</Label>
                            <Dropdown
                                options={METHODS.map(method => ({ label: method.toUpperCase(), value: method }))}
                                value={method}
                                onChange={m => setMethod(m as Method)}
                            />
                            <Input
                                name="endpoint"
                                id="endpoint"
                                value={endpoint}
                                onChange={e => setEndpoint(e.target.value)}
                            />
                            <p className="mb-4">
                                [{method.toUpperCase()}]: {process.env.NEXT_PUBLIC_API_URL}
                                {endpoint}
                            </p>
                            <button
                                className="button active w-[100%_!important] justify-between"
                                onClick={handleSubmit}
                            >
                                Trigger {loading ? <Spinner size={12} /> : <ArrowRight size={16} />}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </main>
    )
}

export default Commands
