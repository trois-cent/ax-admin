'use client'

import dynamic from 'next/dynamic'
import { FC, Suspense } from 'react'

// Dynamically import the component with SSR disabled
const SearchBox = dynamic(() => import('./city-input'), { ssr: false })

type CityInputProps = {
    value?: string
    onSelection: (f: GeoJSON.Feature) => void
}

export const CityInput: FC<CityInputProps> = props => {
    return (
        <Suspense fallback={<div className='input radius-sm'>Loading intelligent input...</div>}>
            <SearchBox {...props} />
        </Suspense>
    )
}
