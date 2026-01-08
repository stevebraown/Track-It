import { create } from 'zustand'
import { HabitEntry } from '../types'
import { entryStorage } from '../utils/storage'

interface EntryStore {
  entries: HabitEntry[]
  isLoading: boolean

  // Actions
  loadEntries: () => void
  upsertEntry: (habitId: string, date: string, completed: boolean, notes?: string) => HabitEntry
  deleteEntry: (habitId: string, date: string) => void
  getEntryByHabitAndDate: (habitId: string, date: string) => HabitEntry | undefined
  getEntriesByDate: (date: string) => HabitEntry[]
  getEntriesByHabitId: (habitId: string) => HabitEntry[]
}

export const useEntryStore = create<EntryStore>((set, get) => ({
  entries: [],
  isLoading: false,

  loadEntries: () => {
    set({ isLoading: true })
    try {
      const entries = entryStorage.getAll()
      set({ entries, isLoading: false })
    } catch (error) {
      console.error('Error loading entries:', error)
      set({ isLoading: false })
    }
  },

  upsertEntry: (habitId: string, date: string, completed: boolean, notes?: string) => {
    const entry = entryStorage.upsert(habitId, date, completed, notes)
    set((state) => {
      const existingIndex = state.entries.findIndex(
        (e) => e.habitId === habitId && e.date === date
      )
      if (existingIndex >= 0) {
        // Update existing entry
        const newEntries = [...state.entries]
        newEntries[existingIndex] = entry
        return { entries: newEntries }
      } else {
        // Add new entry
        return { entries: [...state.entries, entry] }
      }
    })
    return entry
  },

  deleteEntry: (habitId: string, date: string) => {
    entryStorage.delete(habitId, date)
    set((state) => ({
      entries: state.entries.filter(
        (e) => !(e.habitId === habitId && e.date === date)
      ),
    }))
  },

  getEntryByHabitAndDate: (habitId: string, date: string) => {
    return get().entries.find((e) => e.habitId === habitId && e.date === date)
  },

  getEntriesByDate: (date: string) => {
    return get().entries.filter((e) => e.date === date)
  },

  getEntriesByHabitId: (habitId: string) => {
    return get().entries.filter((e) => e.habitId === habitId)
  },
}))
