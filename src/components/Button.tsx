import { ButtonHTMLAttributes, ReactNode, useState } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'destructive' | 'ghost'
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  className = '',
  children,
  onMouseDown,
  onMouseUp,
  ...props
}: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  const baseStyles =
    'min-h-[44px] px-5 py-2.5 rounded-full font-medium text-body transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants = {
    primary:
      'bg-[var(--accent-gradient)] text-white hover:translate-y-[-1px] active:scale-[0.98] focus:ring-[var(--accent)] shadow-[var(--accent-shadow)]',
    success:
      'bg-success text-white hover:bg-success-hover active:scale-[0.98] focus:ring-success shadow-sm hover:shadow-md',
    destructive:
      'bg-destructive text-white hover:bg-destructive-hover active:scale-[0.98] focus:ring-destructive shadow-sm hover:shadow-md',
    ghost:
      'bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-surface)] active:scale-[0.98] focus:ring-[var(--accent)] border border-transparent',
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsPressed(true)
    onMouseDown?.(e)
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsPressed(false)
    onMouseUp?.(e)
  }

  const handleMouseLeave = () => {
    setIsPressed(false)
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${isPressed ? 'scale-95' : ''} ${className}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  )
}
