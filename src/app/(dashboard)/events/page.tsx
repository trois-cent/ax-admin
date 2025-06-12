'use client'

import { Plus } from 'lucide-react'

import useSWR from 'swr'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FormModal } from '@/components/forms/FormModal'
import { EventForm } from '@/components/forms/EventForm'
import { mapEventTypeToDisplayName } from '@/mappers'
import { AnimatePresence } from 'framer-motion'
import { eventFetcher } from '@/requests/events'
import { SearchInput } from '@/components/ui/search-input'
import { ToggleSingle } from '@/components/ui/toggles'
import { Spinner } from '@/components/ui/spinner'

type ModalState = {
    open: boolean
    data: AXEvent | null
    action: 'create' | 'update'
}

type LocationFilterOption = 'all' | 'can' | 'usa'

const Events = () => {
    const { data, error, isLoading } = useSWR<AXEvent[]>('/events', eventFetcher)

    const [filteredData, setFilteredData] = useState<AXEvent[]>(data || [])
    const [locationFilter, setLocationFilter] = useState<LocationFilterOption>('all')
    const [searchValue, setSearchValue] = useState<string>('')

    const [modal, setModal] = useState<ModalState>({
        open: false,
        data: null,
        action: 'create',
    })

    const openModal = (event: AXEvent | null, action: 'create' | 'update') => {
        setModal({
            open: true,
            data: event,
            action,
        })
    }

    const filterBySearch = (events: AXEvent[]) => {
        if (!searchValue.trim()) return events

        const remainingOrgs = events.filter(event => {
            const nameMatch = event.name.toLowerCase().includes(searchValue.toLowerCase())
            const cityMatch = event.location?.shortname?.toLowerCase().includes(searchValue.toLowerCase())

            return nameMatch || cityMatch
        })

        return remainingOrgs || []
    }

    const filterByLocation = (events: AXEvent[]) => {
        const remainingOrgs = events.filter(event =>
            locationFilter === 'all'
                ? true
                : event.location?.country?.countryCode === locationFilter.toUpperCase()
                ? true
                : false
        )

        return remainingOrgs || []
    }

    useEffect(() => {
        if (!data) return

        setFilteredData(filterBySearch(filterByLocation(data)))
    }, [data, locationFilter, searchValue])

    return (
        <main className="pb-0">
            {/* header */}
            <div className="flex items-center justify-between">
                <h1>Events</h1>
                <button className="button square" onClick={() => openModal(null, 'create')}>
                    <Plus size={26} />
                </button>
            </div>

            {/* controls */}
            <div className="flex items-center justify-between">
                {/* <div className="card w-[450px] px-6 h-[60px] flex items-center justify-between">
                    Search by name... <button className="button small">Search</button>
                </div>
                <div className="flex gap-2">
                    <button className="button active">All</button>
                    <button className="button">USA</button>
                    <button className="button">CAN</button>
                </div> */}
                <SearchInput onSearch={query => setSearchValue(query)} placeholder="Search by name or city..." />
                <ToggleSingle
                    value={locationFilter}
                    options={[
                        {
                            value: 'all',
                            content: 'All',
                        },
                        {
                            value: 'can',
                            content: 'CAN',
                        },
                        {
                            value: 'usa',
                            content: 'USA',
                        },
                    ]}
                    onChange={value => setLocationFilter(value as LocationFilterOption)}
                />
            </div>

            {/* data table */}
            {error ? (
                <div className="w-full h-full flex items-center justify-center">Error: {error}</div>
            ) : isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                    <Spinner size={26} />
                </div>
            ) : filteredData.length > 0 ? (
                <div className="data-table">
                    {/* Table header */}
                    <div className="grid grid-cols-12 gap-4 px-6 pb-2 text-sm">
                        <div className="col-span-5">Name</div>
                        <div className="col-span-2">Starts on</div>
                        <div className="col-span-2">Location</div>
                        <div className="col-span-2">Visibility</div>
                    </div>

                    {/* Table rows */}
                    <div className="pb-12 flex flex-col gap-2 h-[calc(100%_-_28px)] overflow-auto scrollbar-none">
                        {filteredData.map((event, i) => (
                            <TableRow index={i} key={i} event={event as unknown as AXEvent} openModal={openModal} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="w-full h-full flex items-center justify-center">No events found.</div>
            )}
            <AnimatePresence mode="wait">
                {modal.open && (
                    <FormModal close={() => setModal({ ...modal, open: false, data: null })}>
                        <EventForm
                            defaultValues={modal.data!}
                            action={modal.action}
                            closeModal={() => setModal({ ...modal, open: false, data: null })}
                        />
                    </FormModal>
                )}
            </AnimatePresence>
        </main>
    )
}

export default Events

type TableRowProps = {
    index: number
    event: AXEvent
    openModal: (event: AXEvent, action: 'create' | 'update') => void
}

function TableRow({ index, event, openModal }: TableRowProps) {
    return (
        <motion.button
            initial={{ opacity: 0, y: 100 }}
            animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.25, ease: [0.215, 0.61, 0.355, 1], delay: index * 0.07 },
            }}
            onClick={() => openModal(event, 'update')}
            className="card accent-hover cursor-pointer full-width grid grid-cols-12 text-left gap-4 px-6 py-4 items-center"
        >
            <div className="col-span-5 text-black">{event.name}</div>
            <div className="col-span-2 text-black">
                {new Date(event.startDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })}
            </div>
            <div className="col-span-2 text-black">
                {event.location?.shortname}, {event.location.region?.regionCode}
            </div>
            <div className="col-span-2 text-black">
                <div className={`badge no-color-change cursor-pointer ${event.listed ? 'green' : 'red'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${event.listed ? 'bg-green' : 'bg-red'}`} />
                    <span className="no-color-change">{event.listed ? 'Listed' : 'Unlisted'}</span>
                </div>
            </div>
            <div className="col-span-1 text-black flex justify-end">
                {event?.websiteUrl && (
                    <a
                        href={event.websiteUrl}
                        onClick={e => e.stopPropagation()}
                        target="_blank"
                        className="button small accent-hover"
                    >
                        Visit Website
                    </a>
                )}
            </div>
        </motion.button>
    )
}
