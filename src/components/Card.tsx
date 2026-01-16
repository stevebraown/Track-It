import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export default function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-16 p-5 shadow-[var(--card-shadow)] transition-all duration-300 ${
        onClick
          ? 'cursor-pointer hover:shadow-[var(--card-shadow-hover)] active:scale-[0.98]'
          : 'hover:shadow-[var(--card-shadow-hover)]'
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
