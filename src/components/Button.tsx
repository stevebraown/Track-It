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
    'px-4 py-2 rounded-8 font-medium text-body transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants = {
    primary:
      'bg-primary text-white hover:bg-primary-hover active:scale-95 focus:ring-primary shadow-sm hover:shadow-md',
    success:
      'bg-success text-white hover:bg-success-hover active:scale-95 focus:ring-success shadow-sm hover:shadow-md',
    destructive:
      'bg-destructive text-white hover:bg-destructive-hover active:scale-95 focus:ring-destructive shadow-sm hover:shadow-md',
    ghost:
      'bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-surface)] active:scale-95 focus:ring-primary',
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
