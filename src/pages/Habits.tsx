import { useState, useEffect } from 'react'
import { useHabitStore } from '../stores'
import { Habit, CadenceType, WeeklyCadence, DurationUnit, Priority } from '../types'
import HabitForm from '../components/HabitForm'
import HabitList from '../components/HabitList'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Habits() {
  const habits = useHabitStore((state) => state.habits)
  const isLoading = useHabitStore((state) => state.isLoading)
  const createHabit = useHabitStore((state) => state.createHabit)
  const updateHabit = useHabitStore((state) => state.updateHabit)
  const deleteHabit = useHabitStore((state) => state.deleteHabit)
  const loadHabits = useHabitStore((state) => state.loadHabits)

  const [showForm, setShowForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined)

  // Load habits on mount
  useEffect(() => {
    loadHabits()
  }, [loadHabits])

  const handleSubmit = (data: {
    name: string
    cadence: CadenceType
    cadenceConfig: WeeklyCadence
    duration: { value: number; unit: DurationUnit }
    priority: Priority
    reminderTime?: string
    description?: string
  }) => {
    if (editingHabit) {
      // Update existing habit
      updateHabit({
        id: editingHabit.id,
        ...data,
        updatedAt: new Date().toISOString(),
      })
      setEditingHabit(undefined)
    } else {
      // Create new habit
      createHabit(data)
    }
    setShowForm(false)
  }

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingHabit(undefined)
  }

  const handleDelete = (habitId: string) => {
    deleteHabit(habitId)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-h1">Habits</h2>
        {!showForm && (
          <Button variant="primary" onClick={() => setShowForm(true)}>
            + New Habit
          </Button>
        )}
      </div>

      {showForm && (
        <HabitForm
          habit={editingHabit}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      <HabitList
        habits={habits}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
