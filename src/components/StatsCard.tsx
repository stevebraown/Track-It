import Card from './Card'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export default function StatsCard({
  title,
  value,
  subtitle,
  trend,
  className = '',
}: StatsCardProps) {
  return (
    <Card className={className}>
      <div className="flex flex-col">
        <p className="text-small text-[var(--text-secondary)] mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-h2 font-semibold">{value}</p>
          {trend && (
            <span
              className={`text-small ${
                trend === 'up'
                  ? 'text-success'
                  : trend === 'down'
                  ? 'text-destructive'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-small text-[var(--text-secondary)] mt-1">{subtitle}</p>
        )}
      </div>
    </Card>
  )
}
