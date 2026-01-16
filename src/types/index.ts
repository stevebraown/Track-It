/**
 * Habit Priority Levels
 */
export type Priority = 'low' | 'medium' | 'high'

/**
 * Habit Categories
 */
export type HabitCategory =
  | 'health'
  | 'fitness'
  | 'learning'
  | 'productivity'
  | 'social'
  | 'mindfulness'
  | 'creativity'
  | 'finance'
  | 'sleep'
  | 'nutrition'
  | 'reading'
  | 'hobby'

/**
 * Habit Status
 */
export type HabitStatus = 'active' | 'paused' | 'archived'

/**
 * Habit Cadence Types
 * - daily: Every day
 * - weekly: Specific days of the week
 * - custom: Custom pattern (for future use)
 */
export type CadenceType = 'daily' | 'weekly' | 'custom'

/**
 * Days of the week (0 = Sunday, 6 = Saturday)
 */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

/**
 * Duration unit for habit commitment
 */
export type DurationUnit = 'days' | 'weeks' | 'months'

/**
 * Weekly cadence configuration
 * Specifies which days of the week the habit should be done
 */
export interface WeeklyCadence {
  days: DayOfWeek[] // e.g., [1, 3, 5] for Mon, Wed, Fri
}

/**
 * Custom cadence configuration (for future extensibility)
 */
export interface CustomCadence {
  pattern: string // Placeholder for future custom patterns
}

/**
 * Cadence configuration union type
 */
export type CadenceConfig = WeeklyCadence | CustomCadence

/**
 * Main Habit model
 */
export interface Habit {
  id: string // Unique identifier (UUID or timestamp-based)
  name: string // Habit name
  category: HabitCategory
  status: HabitStatus
  targetFrequency?: number // times per week
  targetDuration?: number // minutes per session
  icon?: string
  cadence: CadenceType // Type of cadence
  cadenceConfig: CadenceConfig // Configuration for the cadence
  duration: {
    value: number // e.g., 30
    unit: DurationUnit // e.g., 'days'
  }
  priority: Priority
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  reminderTime?: string // Optional: HH:mm format (e.g., "09:00")
  description?: string // Optional: Additional notes
}

/**
 * Habit Entry (completion record for a specific date)
 */
export interface HabitEntry {
  habitId: string // Reference to Habit.id
  date: string // ISO date string (YYYY-MM-DD format)
  completed: boolean // Whether the habit was completed
  notes?: string // Optional: Notes for this specific entry
  duration?: number // Optional: minutes spent
  mood?: 'great' | 'good' | 'okay' | 'difficult'
  timestamp?: string // Optional: ISO timestamp
}

/**
 * Daily Reflection
 * One reflection per day
 */
export interface DailyReflection {
  date: string // ISO date string (YYYY-MM-DD format)
  text: string // Reflection content
}

/**
 * Storage schema structure
 * This represents the entire data structure stored in localStorage
 */
export interface AppData {
  habits: Habit[]
  entries: HabitEntry[]
  reflections: DailyReflection[]
  version: string // Data schema version for migration support
}

/**
 * Helper type for creating a new habit (without id, timestamps)
 */
export type CreateHabitInput = Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>

/**
 * Helper type for updating a habit (all fields optional except id)
 */
export type UpdateHabitInput = Partial<Omit<Habit, 'id' | 'createdAt'>> & {
  id: string
  updatedAt: string
}
