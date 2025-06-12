'use client'

import { FC, useRef } from 'react'
import './form-modal.scss'
import { motion } from 'framer-motion'

type FormModalProps = {
    children?: React.ReactNode
    close?: () => void
}

export const FormModal: FC<FormModalProps> = ({ close, children }) => {
    const modalRef = useRef<HTMLDivElement>(null)

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            close?.()
        }
    }

    return (
        <div className="form-modal">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 1,
                    transition: {
                        duration: 0.35,
                        ease: [0.215, 0.61, 0.355, 1],
                    },
                }}
                exit={{
                    opacity: 0,
                    transition: {
                        duration: 0.25,
                        ease: [0.215, 0.61, 0.355, 1],
                        delay: 0.15,
                    },
                }}
                className="overlay"
                onClick={handleOverlayClick}
            />
            <motion.div
                initial={{ x: '120%' }}
                animate={{
                    x: 0,
                    transition: { ease: 'circOut', duration: 0.15 },
                }}
                exit={{
                    x: '120%',
                    transition: { ease: 'circIn', duration: 0.15 },
                }}
                ref={modalRef}
                className="modal scrollbar-none"
            >
                {children}
            </motion.div>
        </div>
    )
}
