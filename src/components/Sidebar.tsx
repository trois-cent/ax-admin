'use client'

import Link from 'next/link'
import Logo from './Logo'

import { usePathname } from 'next/navigation'
import useSWR from 'swr'
import { userFetcher } from '@/requests/auth'

const links = [
    {
        name: 'Dashboard',
        href: '/',
    },
    {
        name: 'Organizations',
        href: '/organizations',
    },
    {
        name: 'Events',
        href: '/events',
    },
]

export const Sidebar = () => {
    const { data: user } = useSWR<User>('/users/admin', userFetcher)

    const url = usePathname()

    return (
        <nav className="flex flex-col items-center justify-between">
            <a href="https://www.athlete-x.io" target="_blank" className="button square">
                <Logo color="var(--black)" width={34} />
            </a>

            <ul>
                {links.map(link => (
                    <li key={link.name} className="my-2">
                        <Link
                            href={link.href}
                            className={`button vertical ${
                                (link.href !== '/' && url.includes(link.href)) || url === link.href ? 'active' : ''
                            }`}
                        >
                            {link.name}
                        </Link>
                    </li>
                ))}
            </ul>

            <button className="button square">
                {user ? `${user?.firstname.substring(0, 1)}.${user?.lastname.substring(0, 1)}` : '...'}
            </button>
        </nav>
    )
}
