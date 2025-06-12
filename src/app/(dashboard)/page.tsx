'use client'

import Slider from '@/components/ui/slider'
import { statsFetcher } from '@/requests/stats'
import useSWR, { mutate } from 'swr'
import { motion } from 'framer-motion'
import Counter from '@/components/ui/counter'
import { userFetcher } from '@/requests/auth'
import { useEffect } from 'react'

const stats: { label: string; key: keyof Stats }[] = [
    {
        label: 'Users',
        key: 'userCount',
    },
    {
        label: 'Subscribed Users',
        key: 'subscribedUserCount',
    },
    {
        label: 'Partner Organizations',
        key: 'organizationCount',
    },
    {
        label: 'Completed Identity Tests',
        key: 'completedIdentityCount',
    },
    {
        label: 'Events',
        key: 'eventCount',
    },
    {
        label: 'Contacts',
        key: 'totalContactCount',
    },
]

export default function Home() {
    const { data, error, isLoading } = useSWR('/stats', statsFetcher)
    const { data: user, error: userError, isLoading: userLoading } = useSWR('/users/admin', userFetcher)

    useEffect(() => {
        console.log(user)
    }, [user])

    return (
        <main className="relative z-10 justify-between p-[0px_!important]">
            <div className="p-12">
                {user && (
                    <>
                        <p className="pl-0.5">Welcome,</p>
                        <h1 className="mt-2">
                            {user?.firstname} {user?.lastname}
                        </h1>
                    </>
                )}
            </div>

            <div className="flex flex-col gap-8 pb-12">
                <div className="px-12">
                    <p>Latest stats.</p>
                </div>

                <Slider
                    paddingX={48}
                    height={384}
                    rightControls={
                        <button className="button gap-4" onClick={() => mutate('/stats')}>
                            Refresh
                        </button>
                    }
                >
                    {stats.map((stat, i) => (
                        <motion.div
                            initial={{ opacity: 0, x: 150 }}
                            animate={{
                                opacity: 1,
                                x: 0,
                                transition: { duration: 0.25, ease: [0.215, 0.61, 0.355, 1], delay: i * 0.07 },
                            }}
                            className="relative card h-full aspect-square flex items-center justify-center"
                            key={stat.key}
                        >
                            {data && data[stat.key] && (
                                <Counter
                                    delay={0.1 + i * 0.07}
                                    duration={0.75}
                                    className="text-[86px] font-semibold text-accent"
                                    to={data[stat.key]}
                                />
                            )}
                            <p className="absolute bottom-8 left-1/2 -translate-x-1/2">{stat.label}</p>
                        </motion.div>
                    ))}
                </Slider>
            </div>
        </main>
    )
}
