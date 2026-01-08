import { ReactNode } from 'react'
import Card from './Card'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card>
      <div className="text-center py-8">
        {icon && <div className="mb-4 text-4xl">{icon}</div>}
        <h3 className="text-h3 mb-2 text-[var(--text-primary)]">{title}</h3>
        {description && (
          <p className="text-body text-[var(--text-secondary)] mb-4">{description}</p>
        )}
        {action && <div className="mt-4">{action}</div>}
      </div>
    </Card>
  )
}
