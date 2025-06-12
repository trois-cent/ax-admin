'use client'

import { FC, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { FormControl } from './form'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command'

type ComboboxProps = {
    value: string | undefined
    onChange: (value: string) => void
    options: { value: string; label: string }[]
    placeholder?: string
}

export const Combobox: FC<ComboboxProps> = ({ value, onChange, options, placeholder }) => {
    useEffect(() => {
        console.log('value: ', value)
    }, [value])

    return (
        <Popover>
            <PopoverTrigger asChild className="w-full">
                <FormControl>
                    <button
                        role="combobox"
                        className={cn('button full-width between', value ? 'text-black' : 'text-low-opac-text')}
                    >
                        {value && value.length > 0
                            ? options.find(option => option.value === value)?.label
                            : placeholder || ''}
                        <ChevronsUpDown size={16} className="text-low-opac-text" />
                    </button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" side="bottom" align="start">
                <Command className="w-full">
                    <CommandInput placeholder="Type something..." className="text-low-opac-text h-9" />
                    <CommandList className="max-h-[250px]">
                        <CommandEmpty>Nothing matches your search...</CommandEmpty>
                        <CommandGroup>
                            {options.map(option => (
                                <CommandItem
                                    value={option.label}
                                    key={option.value}
                                    onSelect={() => onChange(option.value)}
                                >
                                    {option.label}
                                    <Check
                                        className={cn('ml-auto', option.value === value ? 'opacity-100' : 'opacity-0')}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
