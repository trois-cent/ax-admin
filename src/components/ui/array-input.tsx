'use client'

import { useFieldArray, useFormContext } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { ChevronsDownUp, Plus } from 'lucide-react'
import { useState } from 'react'
import { ConfirmationButton } from './confirmation-button'

type ArrayInputProps = {
    name: string
    label?: string
    renderItem: (field: { id: string }, index: number, remove: (index: number) => void) => React.ReactNode
    unit: string
    defaultObject: object
    titleMapper: (values: any) => string | undefined
}

export const ArrayInput: React.FC<ArrayInputProps> = ({
    name,
    label,
    renderItem,
    unit,
    defaultObject,
    titleMapper,
}) => {
    const { control, watch } = useFormContext()
    const { fields: blocks, append, remove } = useFieldArray({ control, name })

    const initBlockStates = () =>
        blocks.map((block, index) => ({
            open: false,
            title: titleMapper(watchedFields?.[index]) || `${unit} ${index + 1}`,
        }))

    const watchedFields = watch(name)

    const [blockStates, setBlockStates] = useState<
        Array<{
            open: boolean
            title: string
        }>
    >(initBlockStates())

    const setBlockOpen = (index: number, bool: boolean) => {
        setBlockStates(prev => {
            const newBlockStates = [...prev]
            newBlockStates[index] = {
                open: bool,
                title: bool ? prev?.[index]?.title : titleMapper(watchedFields?.[index]) || `${unit} ${index + 1}`,
            }
            return newBlockStates
        })
    }

    const appendBlock = () => {
        append(defaultObject)
        setBlockStates(prev => {
            const newBlockStates = [...prev]
            if (newBlockStates.length > 0) newBlockStates[blocks.length - 1].open = false
            newBlockStates.push({
                open: true,
                title: '',
            })
            return newBlockStates
        })
    }

    const removeBlock = (index: number) => {
        remove(index)
        setBlockStates(prev => {
            const newBlockStates = [...prev]
            newBlockStates.splice(index, 1)
            return newBlockStates
        })
    }

    return (
        <div className="space-y-2">
            {label && <Label>{label}</Label>}

            {blocks.map((block, index) =>
                blockStates[index]?.open ? (
                    <div key={block.id} className="border border-lines rounded-sm px-6 py-4">
                        <div className="space-y-2">{renderItem(block, index, remove)}</div>

                        <div>
                            <button
                                type="button"
                                onClick={() => setBlockOpen(index, false)}
                                className="mt-4 button active h-[40px_!important] full-width between rounded-sm"
                            >
                                Collapse <ChevronsDownUp size={16} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        key={block.id}
                        role="button"
                        className="button full-width between rounded-sm"
                        onClick={() => setBlockOpen(index, true)}
                    >
                        <span className="text-black">{blockStates[index]?.title || `${unit} ${index + 1}`}</span>
                        {/* <button type="button" onClick={() => removeBlock(index)} className="button small rounded-sm">
                            Remove
                        </button> */}
                        <ConfirmationButton
                            buttonLabel="Remove"
                            onConfirm={() => removeBlock(index)}
                            confirmLabel="Remove"
                            cancelLabel="Cancel"
                            title={`Remove ${blockStates[index]?.title}?`}
                            description="This action cannot be undone. Are you sure you want to remove this contact from the list?"
                        />
                    </div>
                )
            )}

            <button type="button" onClick={appendBlock} className="button full-width between rounded-sm">
                Add {unit}
                <Plus className="w-4 h-4" />
            </button>
        </div>
    )
}
