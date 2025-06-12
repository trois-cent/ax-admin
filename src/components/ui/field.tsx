import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'

type Props = {
    name: string
    label: string
    description?: string
    type?: string
}

export const Field: React.FC<Props> = ({ name, label, description, type = 'text' }) => {
    const { control } = useFormContext()

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <Label>{label}</Label>
                    <FormControl>
                        <Input className='small' {...field} type={type} />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
