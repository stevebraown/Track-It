import { useId } from 'react'

interface ProgressRingProps {
  percentage: number
  size?: number
  strokeWidth?: number
  className?: string
  color?: string
}

export default function ProgressRing({
  percentage,
  size = 80,
  strokeWidth = 6,
  className = '',
  color,
}: ProgressRingProps) {
  const gradientId = useId()
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference
  const isLarge = size >= 200

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        style={{ width: size, height: size }}
      >
        <defs>
          <linearGradient id={`progress-gradient-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-start)" />
            <stop offset="100%" stopColor="var(--accent-end)" />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--ring-track)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color || `url(#progress-gradient-${gradientId})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`${isLarge ? 'text-display' : 'text-h3'} font-bold text-[var(--text-primary)]`}>
          {percentage}%
        </span>
      </div>
    </div>
  )
}
