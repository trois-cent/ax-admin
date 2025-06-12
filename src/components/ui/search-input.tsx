import { FC, useState, useRef, useEffect } from 'react'
import { Input } from './input'

type SearchInputProps = {
    placeholder?: string
    onSearch: (query: string) => void
}

export const SearchInput: FC<SearchInputProps> = ({ placeholder, onSearch }) => {
    const [isSearching, setIsSearching] = useState(false)
    const [searchValue, setSearchValue] = useState('')

    const inputRef = useRef<HTMLInputElement>(null)

    const focusInput = () => {
        inputRef.current?.focus()
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.trim()
        setIsSearching(!!query)
        setSearchValue(query)
    }

    const cancelSearch = () => {
        setIsSearching(false)
        setSearchValue('')
        inputRef.current?.blur()
    }

    useEffect(() => {
        onSearch(searchValue)
    }, [searchValue])

    return (
        <div className="relative w-[450px]">
            <Input
                className="rounded-[var(--radius-md)_!important]"
                placeholder={placeholder || 'Type something here...'}
                ref={inputRef}
                onChange={handleSearch}
                value={searchValue}
            />
            <button
                className="absolute top-1/2 right-6 -translate-y-1/2 button small"
                onClick={isSearching ? cancelSearch : focusInput}
            >
                {isSearching ? 'Cancel' : 'Search'}
            </button>
        </div>
    )
}
