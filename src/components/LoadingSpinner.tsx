interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
  text?: string
}

export default function LoadingSpinner({
  size = 'medium',
  className = '',
  text,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`${sizeClasses[size]} border-4 border-[var(--border-color)] border-t-[var(--accent)] rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {text && (
        <p className="text-small text-[var(--text-secondary)] animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}
