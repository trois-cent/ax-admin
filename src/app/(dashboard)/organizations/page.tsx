'use client'

import { Plus } from 'lucide-react'

import useSWR from 'swr'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FormModal } from '@/components/forms/FormModal'
import { OrganizationForm } from '@/components/forms/OrganizationForm'
import { mapOrganizationTypeToDisplayName } from '@/mappers'
import { orgFetcher } from '@/requests/orgs'
import { AnimatePresence } from 'framer-motion'
import { Spinner } from '@/components/ui/spinner'
import { SearchInput } from '@/components/ui/search-input'
import { ToggleSingle } from '@/components/ui/toggles'

type ModalState = {
    open: boolean
    data: Organization | null
    action: 'create' | 'update'
}

type LocationFilterOption = 'all' | 'can' | 'usa'

const Organizations = () => {
    const { data, error, isLoading } = useSWR<Organization[]>('/organizations', orgFetcher)

    const [filteredData, setFilteredData] = useState<Organization[]>(data || [])
    const [locationFilter, setLocationFilter] = useState<LocationFilterOption>('all')
    const [searchValue, setSearchValue] = useState<string>('')

    const [modal, setModal] = useState<ModalState>({
        open: false,
        data: null,
        action: 'create',
    })

    const openModal = (o: Organization | null, action: 'create' | 'update') => {
        setModal({
            open: true,
            data: o,
            action,
        })
    }

    const filterBySearch = (orgs: Organization[]) => {
        if (!searchValue.trim()) return orgs

        const remainingOrgs = orgs.filter(org => {
            const nameMatch = org.name.toLowerCase().includes(searchValue.toLowerCase())
            const cityMatch = org.location?.shortname?.toLowerCase().includes(searchValue.toLowerCase())

            return nameMatch || cityMatch
        })

        return remainingOrgs || []
    }

    const filterByLocation = (orgs: Organization[]) => {
        const remainingOrgs = orgs.filter(org =>
            locationFilter === 'all'
                ? true
                : org.location?.country?.countryCode === locationFilter.toUpperCase()
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
                <h1>Organizations</h1>
                <button onClick={() => openModal(null, 'create')} className="button square">
                    <Plus size={26} />
                </button>
            </div>

            {/* controls */}
            <div className="flex items-center justify-between">
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
                        <div className="col-span-2">Type</div>
                        <div className="col-span-2">Location</div>
                        <div className="col-span-1">Visibility</div>
                        <div className="col-span-1"></div>
                    </div>

                    {/* Table rows */}
                    <div className="pb-12 flex flex-col gap-2 h-[calc(100%_-_28px)] overflow-auto scrollbar-none">
                        {filteredData.map((org, i) => (
                            <TableRow index={i} key={i} organization={org} openModal={() => openModal(org, 'update')} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="w-full h-full flex items-center justify-center">No organizations found.</div>
            )}
            <AnimatePresence mode="wait">
                {modal.open && (
                    <FormModal close={() => setModal({ ...modal, open: false, data: null })}>
                        <OrganizationForm
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

export default Organizations

type TableRowProps = {
    index: number
    organization: Organization
    openModal: (org: Organization) => void
}

function TableRow({ index, organization: o, openModal }: TableRowProps) {
    return (
        <motion.button
            initial={{ opacity: 0, y: 100 }}
            animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.25, ease: [0.215, 0.61, 0.355, 1], delay: index * 0.07 },
            }}
            className="card accent-hover cursor-pointer full-width grid grid-cols-12 text-left gap-4 px-6 py-4 items-center bg-muted/20 hover:bg-muted/30 transition-colors"
            onClick={() => openModal(o)}
        >
            <div className="col-span-5 text-black">{o.name}</div>
            <div className="col-span-2 text-black">{mapOrganizationTypeToDisplayName(o.type, o?.schoolType)}</div>
            <div className="col-span-2 text-black">
                {o.location?.shortname}, {o.location.region?.regionCode}
            </div>
            <div className="col-span-2 text-black">
                <div className={`badge no-color-change cursor-pointer ${o.listed ? 'green' : 'red'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${o.listed ? 'bg-green' : 'bg-red'}`} />
                    <span className="no-color-change">{o.listed ? 'Listed' : 'Unlisted'}</span>
                </div>
            </div>
            {o?.websiteUrl && (
                <div className="col-span-1 text-black flex justify-end">
                    <a
                        href={o.websiteUrl}
                        target="_blank"
                        className="button small accent-hover"
                        onClick={e => e.stopPropagation()}
                    >
                        Visit Website
                    </a>
                </div>
            )}
        </motion.button>
    )
}
