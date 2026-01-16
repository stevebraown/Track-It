import { AppData, Habit, HabitEntry, DailyReflection, CreateHabitInput, UpdateHabitInput, HabitCategory } from '../types'
import { generateHabitId } from './habit'
import { getTodayISO } from './date'

/**
 * Storage keys for localStorage
 */
const STORAGE_KEYS = {
  APP_DATA: 'trackit_app_data',
} as const

/**
 * Current data schema version
 * Increment this when making breaking changes to the data structure
 */
const DATA_VERSION = '1.0.0'

const DEFAULT_CATEGORY: HabitCategory = 'productivity'

function normalizeHabits(habits: Habit[]): Habit[] {
  return habits.map((habit) => {
    const weeklyDays =
      habit.cadence === 'weekly' && 'days' in habit.cadenceConfig
        ? habit.cadenceConfig.days.length
        : undefined

    return {
      ...habit,
      category: habit.category ?? DEFAULT_CATEGORY,
      status: habit.status ?? 'active',
      targetFrequency:
        habit.targetFrequency ?? (habit.cadence === 'daily' ? 7 : weeklyDays),
      targetDuration: habit.targetDuration ?? undefined,
      icon: habit.icon ?? undefined,
    }
  })
}

/**
 * Default/empty app data structure
 */
function getDefaultData(): AppData {
  return {
    habits: [],
    entries: [],
    reflections: [],
    version: DATA_VERSION,
  }
}

/**
 * Load all app data from localStorage
 */
export function loadAppData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.APP_DATA)
    if (!stored) {
      return getDefaultData()
    }

    const data = JSON.parse(stored) as AppData
    
    // Validate version and migrate if needed (for future migrations)
    if (data.version !== DATA_VERSION) {
      // TODO: Add migration logic here when needed
      console.warn(`Data version mismatch: ${data.version} vs ${DATA_VERSION}`)
    }

    // Ensure all required fields exist
    return {
      habits: normalizeHabits(data.habits || []),
      entries: data.entries || [],
      reflections: data.reflections || [],
      version: data.version || DATA_VERSION,
    }
  } catch (error) {
    console.error('Error loading app data:', error)
    return getDefaultData()
  }
}

/**
 * Save all app data to localStorage
 */
export function saveAppData(data: AppData): void {
  try {
    const dataToSave = {
      ...data,
      version: DATA_VERSION,
    }
    localStorage.setItem(STORAGE_KEYS.APP_DATA, JSON.stringify(dataToSave))
  } catch (error) {
    console.error('Error saving app data:', error)
    throw new Error('Failed to save data to localStorage')
  }
}

/**
 * Habit CRUD operations
 */
export const habitStorage = {
  /**
   * Get all habits
   */
  getAll(): Habit[] {
    const data = loadAppData()
    return data.habits
  },

  /**
   * Get a habit by ID
   */
  getById(id: string): Habit | undefined {
    const habits = habitStorage.getAll()
    return habits.find((h) => h.id === id)
  },

  /**
   * Create a new habit
   */
  create(input: CreateHabitInput): Habit {
    const data = loadAppData()
    const now = new Date().toISOString()
    
    const newHabit: Habit = {
      category: input.category ?? DEFAULT_CATEGORY,
      status: input.status ?? 'active',
      targetFrequency:
        input.targetFrequency ??
        (input.cadence === 'daily'
          ? 7
          : 'days' in input.cadenceConfig
          ? input.cadenceConfig.days.length
          : undefined),
      targetDuration: input.targetDuration ?? undefined,
      icon: input.icon ?? undefined,
      ...input,
      id: generateHabitId(),
      createdAt: now,
      updatedAt: now,
    }

    data.habits.push(newHabit)
    saveAppData(data)
    return newHabit
  },

  /**
   * Update an existing habit
   */
  update(input: UpdateHabitInput): Habit {
    const data = loadAppData()
    const index = data.habits.findIndex((h) => h.id === input.id)
    
    if (index === -1) {
      throw new Error(`Habit with id ${input.id} not found`)
    }

    const updatedHabit: Habit = {
      ...data.habits[index],
      ...input,
      updatedAt: new Date().toISOString(),
    }

    data.habits[index] = updatedHabit
    saveAppData(data)
    return updatedHabit
  },

  /**
   * Delete a habit by ID
   */
  delete(id: string): void {
    const data = loadAppData()
    data.habits = data.habits.filter((h) => h.id !== id)
    // Also delete all entries for this habit
    data.entries = data.entries.filter((e) => e.habitId !== id)
    saveAppData(data)
  },
}

/**
 * Habit Entry CRUD operations
 */
export const entryStorage = {
  /**
   * Get all entries
   */
  getAll(): HabitEntry[] {
    const data = loadAppData()
    return data.entries
  },

  /**
   * Get entries for a specific habit
   */
  getByHabitId(habitId: string): HabitEntry[] {
    const entries = entryStorage.getAll()
    return entries.filter((e) => e.habitId === habitId)
  },

  /**
   * Get entry for a specific habit and date
   */
  getByHabitAndDate(habitId: string, date: string): HabitEntry | undefined {
    const entries = entryStorage.getAll()
    return entries.find((e) => e.habitId === habitId && e.date === date)
  },

  /**
   * Get all entries for a specific date
   */
  getByDate(date: string): HabitEntry[] {
    const entries = entryStorage.getAll()
    return entries.filter((e) => e.date === date)
  },

  /**
   * Create or update an entry
   */
  upsert(habitId: string, date: string, completed: boolean, notes?: string): HabitEntry {
    const data = loadAppData()
    const existingIndex = data.entries.findIndex(
      (e) => e.habitId === habitId && e.date === date
    )

    const entry: HabitEntry = {
      habitId,
      date,
      completed,
      notes,
      timestamp: completed ? new Date().toISOString() : undefined,
    }

    if (existingIndex >= 0) {
      data.entries[existingIndex] = entry
    } else {
      data.entries.push(entry)
    }

    saveAppData(data)
    return entry
  },

  /**
   * Delete an entry
   */
  delete(habitId: string, date: string): void {
    const data = loadAppData()
    data.entries = data.entries.filter(
      (e) => !(e.habitId === habitId && e.date === date)
    )
    saveAppData(data)
  },
}

/**
 * Daily Reflection CRUD operations
 */
export const reflectionStorage = {
  /**
   * Get all reflections
   */
  getAll(): DailyReflection[] {
    const data = loadAppData()
    return data.reflections
  },

  /**
   * Get reflection for a specific date
   */
  getByDate(date: string): DailyReflection | undefined {
    const reflections = reflectionStorage.getAll()
    return reflections.find((r) => r.date === date)
  },

  /**
   * Get today's reflection
   */
  getToday(): DailyReflection | undefined {
    return reflectionStorage.getByDate(getTodayISO())
  },

  /**
   * Create or update a reflection for a date
   */
  upsert(date: string, text: string): DailyReflection {
    const data = loadAppData()
    const existingIndex = data.reflections.findIndex((r) => r.date === date)

    const reflection: DailyReflection = {
      date,
      text,
    }

    if (existingIndex >= 0) {
      data.reflections[existingIndex] = reflection
    } else {
      data.reflections.push(reflection)
    }

    saveAppData(data)
    return reflection
  },

  /**
   * Delete a reflection for a date
   */
  delete(date: string): void {
    const data = loadAppData()
    data.reflections = data.reflections.filter((r) => r.date !== date)
    saveAppData(data)
  },
}

/**
 * Export all data as JSON (for backup)
 */
export function exportData(): string {
  const data = loadAppData()
  return JSON.stringify(data, null, 2)
}

/**
 * Import data from JSON (for restore)
 */
export function importData(jsonString: string): void {
  try {
    const data = JSON.parse(jsonString) as AppData
    
    // Validate structure
    if (!data.habits || !data.entries || !data.reflections) {
      throw new Error('Invalid data format')
    }

    // Save imported data
    saveAppData(data)
  } catch (error) {
    console.error('Error importing data:', error)
    throw new Error('Failed to import data. Please check the file format.')
  }
}

/**
 * Clear all data (use with caution!)
 */
export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.APP_DATA)
}
