import { FC } from 'react'

type ToggleGroupProps = {
    options: Array<{
        value: string
        content: React.ReactNode
    }>
    onChange?: (value: string | string[]) => void
    value: string
}

export const ToggleSingle: FC<ToggleGroupProps> = ({ options, onChange, value }) => {
    return (
        <div className="flex items-center gap-2">
            {options.map(option => (
                <button
                    key={option.value}
                    value={option.value}
                    onClick={() => onChange?.(option.value)}
                    className={`button ${value === option.value ? 'active' : ''}`}
                >
                    {option.content}
                </button>
            ))}
        </div>
    )
}
