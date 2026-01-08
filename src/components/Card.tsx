import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export default function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-8 p-4 shadow-card transition-all duration-200 ${
        onClick
          ? 'cursor-pointer hover:shadow-card-hover active:scale-[0.98]'
          : 'hover:shadow-md'
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
