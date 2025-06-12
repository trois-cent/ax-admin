import React, { FC } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { FormControl } from './form'
import { cn } from '@/lib/utils'

type DropdownProps = {
    value: string | undefined
    onChange: (value: string) => void
    options: { value: string; label: string }[]
    placeholder?: string
    small?: boolean
}

export const Dropdown: FC<DropdownProps> = ({ value, onChange, options, placeholder, small }) => {
    return (
        <Select onValueChange={onChange} defaultValue={value}>
            <FormControl>
                <SelectTrigger
                    className={cn(
                        value ? 'text-[var(--black)_!important]' : '',
                        small ? 'h-[40px_!important] rounded-[var(--radius-sm)_!important] px-[16px_!important]' : ''
                    )}
                    style={{ fontSize: small ? '14px' : undefined }}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
            </FormControl>
            <SelectContent>
                {options.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
