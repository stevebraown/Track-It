import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-8 p-4 ${className}`}
    >
      {children}
    </div>
  )
}
