'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SliderProps {
    children: React.ReactNode
    paddingX?: number
    height?: number
    rightControls?: React.ReactNode
}

export default function Slider({ children, paddingX = 24, height = 300, rightControls }: SliderProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const [constraints, setConstraints] = useState({ left: 0, right: 0 })
    const [atStart, setAtStart] = useState(true)
    const [atEnd, setAtEnd] = useState(false)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const updateConstraints = () => {
            const maxScroll = container.scrollWidth + paddingX - container.clientWidth
            setConstraints({ left: -maxScroll, right: 0 })
        }

        updateConstraints()
        window.addEventListener('resize', updateConstraints)
        return () => window.removeEventListener('resize', updateConstraints)
    }, [children])

    useEffect(() => {
        const unsubscribe = x.onChange(latestX => {
            const container = containerRef.current
            if (!container) return

            const scrollableWidth = container.scrollWidth - container.clientWidth

            setAtStart(latestX >= 0)
            setAtEnd(Math.abs(latestX) >= scrollableWidth - 1)
        })

        return () => unsubscribe()
    }, [x])

    const scrollBy = (dir: 'left' | 'right') => {
        const container = containerRef.current
        if (!container) return

        const clientWidth = container.clientWidth
        const scrollWidth = container.scrollWidth
        const currentX = x.get()

        // Calculate the maximum scrollable distance in each direction
        const maxScroll = scrollWidth - clientWidth

        if (dir === 'left') {
            const remaining = Math.min(clientWidth, -currentX)
            animate(x, currentX + remaining, { type: 'spring', stiffness: 300, damping: 30 })
        } else {
            const remaining = Math.min(clientWidth, maxScroll + currentX + paddingX)
            animate(x, currentX - remaining, { type: 'spring', stiffness: 300, damping: 30 })
        }
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="relative w-full overflow-hidden" style={{ height }}>
                {/* Slider */}
                <motion.div
                    ref={containerRef}
                    className="h-full flex gap-4 touch-pan-x cursor-grab active:cursor-grabbing"
                    style={{
                        x,
                        paddingLeft: paddingX,
                        paddingRight: paddingX,
                    }}
                    drag="x"
                    dragConstraints={constraints}
                    dragMomentum
                >
                    {children}
                </motion.div>
            </div>
            {/* buttons */}
            <div
                className={`flex ${rightControls ? 'justify-between' : 'justify-start'}`}
                style={{ paddingInline: paddingX }}
            >
                <div className="flex gap-2">
                    <button
                        onClick={() => scrollBy('left')}
                        className="button square disabled:opacity-30 disabled:pointer-events-none"
                        disabled={atStart}
                    >
                        <ChevronLeft size={26} />
                    </button>
                    <button
                        onClick={() => scrollBy('right')}
                        className="button square disabled:opacity-30 disabled:pointer-events-none"
                        disabled={atEnd}
                    >
                        <ChevronRight size={26} />
                    </button>
                </div>
                {rightControls}
            </div>
        </div>
    )
}
