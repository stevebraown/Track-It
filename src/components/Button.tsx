import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'destructive' | 'ghost'
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-8 font-medium text-body transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    success: 'bg-success text-white hover:bg-success-hover',
    destructive: 'bg-destructive text-white hover:bg-destructive-hover',
    ghost: 'bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-surface)]',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
