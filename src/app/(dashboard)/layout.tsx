import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'
import '../system.scss'
import { Sidebar } from '@/components/Sidebar'
import { GradientBG } from '@/components/GradientBG'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'Admin Panel | Athlete-X',
    description: 'Admin dashboard of the Athlete-X web platform.',
}

export default function RootLayout({
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
            <body className={`root-layout ${geistSans.variable} ${geistMono.variable} antialiased`}>
                <GradientBG />
                <Sidebar />
                {children}
            </body>
        </html>
    )
}
