import { useState, FormEvent } from 'react'
import { Habit, Priority, CadenceType, DayOfWeek, DurationUnit, WeeklyCadence } from '../types'
import Button from './Button'
import Card from './Card'

interface HabitFormProps {
  habit?: Habit // If provided, we're editing; otherwise, creating
  onSubmit: (data: {
    name: string
    cadence: CadenceType
    cadenceConfig: WeeklyCadence
    duration: { value: number; unit: DurationUnit }
    priority: Priority
    reminderTime?: string
    description?: string
  }) => void
  onCancel?: () => void
}

const DAYS_OF_WEEK = [
  { value: 0 as DayOfWeek, label: 'Sun' },
  { value: 1 as DayOfWeek, label: 'Mon' },
  { value: 2 as DayOfWeek, label: 'Tue' },
  { value: 3 as DayOfWeek, label: 'Wed' },
  { value: 4 as DayOfWeek, label: 'Thu' },
  { value: 5 as DayOfWeek, label: 'Fri' },
  { value: 6 as DayOfWeek, label: 'Sat' },
]

export default function HabitForm({ habit, onSubmit, onCancel }: HabitFormProps) {
  const [name, setName] = useState(habit?.name || '')
  const [cadence, setCadence] = useState<CadenceType>(habit?.cadence || 'daily')
  const [weeklyDays, setWeeklyDays] = useState<DayOfWeek[]>(
    habit?.cadence === 'weekly' ? (habit.cadenceConfig as WeeklyCadence).days : [1, 3, 5] // Default: Mon, Wed, Fri
  )
  const [durationValue, setDurationValue] = useState(habit?.duration.value || 30)
  const [durationUnit, setDurationUnit] = useState<DurationUnit>(habit?.duration.unit || 'days')
  const [priority, setPriority] = useState<Priority>(habit?.priority || 'medium')
  const [reminderTime, setReminderTime] = useState(habit?.reminderTime || '')
  const [description, setDescription] = useState(habit?.description || '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = 'Habit name is required'
    }

    if (cadence === 'weekly' && weeklyDays.length === 0) {
      newErrors.weeklyDays = 'Select at least one day for weekly habits'
    }

    if (durationValue <= 0) {
      newErrors.duration = 'Duration must be greater than 0'
    }

    if (reminderTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(reminderTime)) {
      newErrors.reminderTime = 'Invalid time format (use HH:mm)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }

    onSubmit({
      name: name.trim(),
      cadence,
      cadenceConfig: { days: weeklyDays } as WeeklyCadence,
      duration: { value: durationValue, unit: durationUnit },
      priority,
      reminderTime: reminderTime || undefined,
      description: description.trim() || undefined,
    })
  }

  const toggleDay = (day: DayOfWeek) => {
    setWeeklyDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    )
  }

  return (
    <Card className="mb-6">
      <h3 className="text-h3 mb-4">{habit ? 'Edit Habit' : 'Create New Habit'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-small font-medium mb-2 text-[var(--text-primary)]">
            Habit Name *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-8 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., Exercise, Read, Meditate"
          />
          {errors.name && <p className="text-small text-destructive mt-1">{errors.name}</p>}
        </div>

        {/* Cadence */}
        <div>
          <label className="block text-small font-medium mb-2 text-[var(--text-primary)]">
            Frequency *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="cadence"
                value="daily"
                checked={cadence === 'daily'}
                onChange={(e) => setCadence(e.target.value as CadenceType)}
                className="mr-2"
              />
              <span className="text-body">Daily</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="cadence"
                value="weekly"
                checked={cadence === 'weekly'}
                onChange={(e) => setCadence(e.target.value as CadenceType)}
                className="mr-2"
              />
              <span className="text-body">Weekly</span>
            </label>
          </div>

          {/* Weekly days selector */}
          {cadence === 'weekly' && (
            <div className="mt-3">
              <label className="block text-small font-medium mb-2 text-[var(--text-primary)]">
                Select Days *
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`px-3 py-1 rounded-8 text-small transition-colors ${
                      weeklyDays.includes(day.value)
                        ? 'bg-primary text-white'
                        : 'bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              {errors.weeklyDays && (
                <p className="text-small text-destructive mt-1">{errors.weeklyDays}</p>
              )}
            </div>
          )}
        </div>

        {/* Duration */}
        <div>
          <label className="block text-small font-medium mb-2 text-[var(--text-primary)]">
            Commitment Duration *
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={durationValue}
              onChange={(e) => setDurationValue(parseInt(e.target.value) || 0)}
              className="w-24 px-3 py-2 rounded-8 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary"
              style={{ color: 'var(--text-primary)' }}
            />
            <select
              value={durationUnit}
              onChange={(e) => setDurationUnit(e.target.value as DurationUnit)}
              className="px-3 py-2 rounded-8 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </select>
          </div>
          {errors.duration && (
            <p className="text-small text-destructive mt-1">{errors.duration}</p>
          )}
        </div>

        {/* Priority */}
        <div>
          <label className="block text-small font-medium mb-2 text-[var(--text-primary)]">
            Priority *
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full px-3 py-2 rounded-8 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Reminder Time (optional) */}
        <div>
          <label htmlFor="reminderTime" className="block text-small font-medium mb-2 text-[var(--text-primary)]">
            Reminder Time (optional)
          </label>
          <input
            id="reminderTime"
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="px-3 py-2 rounded-8 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.reminderTime && (
            <p className="text-small text-destructive mt-1">{errors.reminderTime}</p>
          )}
          <p className="text-small text-[var(--text-secondary)] mt-1">
            You'll be reminded at this time (notifications coming in Phase 3)
          </p>
        </div>

        {/* Description (optional) */}
        <div>
          <label htmlFor="description" className="block text-small font-medium mb-2 text-[var(--text-primary)]">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-8 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Add any notes about this habit..."
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button type="submit" variant="primary" className="w-full sm:w-auto">
            {habit ? 'Update Habit' : 'Create Habit'}
          </Button>
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel} className="w-full sm:w-auto">
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}
