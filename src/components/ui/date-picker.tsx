'use client'

import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FormControl } from './form'
import { FC } from 'react'

type DatePickerProps = {
    value: Date | undefined
    onChange: (date: Date | undefined) => void
}

export const DatePicker: FC<DatePickerProps> = ({ value, onChange }) => {
    return (
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
