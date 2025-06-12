import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { GradientBG } from '@/components/GradientBG'

import '../globals.css'
import '../system.scss'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'Authentication | AX Admin Panel',
    description: 'Admin dashboard of the Athlete-X web platform.',
}

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body className={`auth-layout ${geistSans.variable} ${geistMono.variable} antialiased`}>
                <GradientBG />
                {children}
            </body>
        </html>
    )
}
