import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const optionalField = <T extends z.ZodTypeAny>(field: T) =>
    z.preprocess(
        value => (typeof value === 'string' && value.trim() === '' ? undefined : value === null ? undefined : value),
        field.optional()
    ) as unknown as z.ZodOptional<T>
