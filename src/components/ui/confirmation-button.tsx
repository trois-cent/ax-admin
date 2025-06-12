import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './alert-dialog'
import { FC } from 'react'

type ConfirmationButtonProps = {
    title: string
    description: string
    buttonLabel?: React.ReactNode
    confirmLabel?: string
    cancelLabel?: string
    onConfirm: () => void
    onCancel?: () => void
}

export const ConfirmationButton: FC<ConfirmationButtonProps> = ({
    title,
    description,
    buttonLabel,
    confirmLabel,
    cancelLabel,
    onConfirm,
    onCancel,
}) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger className="button small accent-hover" onClick={e => e.stopPropagation()}>
                {buttonLabel}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel || (() => {})}>{cancelLabel}</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>{confirmLabel}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
