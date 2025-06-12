'use client'

import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FormControl } from './form'
import { FC, useState } from 'react'

type DatePickerProps = {
    value: Date | undefined
    onChange: (date: Date | undefined) => void
}

export const DatePicker: FC<DatePickerProps> = ({ value, onChange }) => {
    const [date, setDate] = useState<Date>()

    return (
        // <Popover>
        //     <PopoverTrigger asChild className="w-full">
        //         <button
        //             className={cn(
        //                 'input justify-between',
        //                 !date ? 'text-low-opac-text' : 'text-[var(--black)_!important]'
        //             )}
        //         >
        //             {date ? format(date, 'PPP') : <span>Pick a date</span>}
        //             <CalendarIcon size={16} />
        //         </button>
        //     </PopoverTrigger>
        //     <PopoverContent className="w-auto p-0" align="start">
        //         <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        //     </PopoverContent>
        // </Popover>
        <Popover>
            <PopoverTrigger asChild>
                <FormControl>
                    <button
                        className={cn(
                            'button full-width justify-between',
                            !value ? 'text-low-opac-text' : 'text-[var(--black)_!important]'
                        )}
                    >
                        {value ? format(value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    disabled={date => date.getFullYear() < new Date().getFullYear() || date < new Date('1900-01-01')}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}
