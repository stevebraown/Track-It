import { create } from 'zustand'
import { DailyReflection } from '../types'
import { reflectionStorage } from '../utils/storage'

interface ReflectionStore {
  reflections: DailyReflection[]
  isLoading: boolean

  // Actions
  loadReflections: () => void
  upsertReflection: (date: string, text: string) => DailyReflection
  deleteReflection: (date: string) => void
  getReflectionByDate: (date: string) => DailyReflection | undefined
  getTodayReflection: () => DailyReflection | undefined
}

export const useReflectionStore = create<ReflectionStore>((set, get) => ({
  reflections: [],
  isLoading: false,

  loadReflections: () => {
    set({ isLoading: true })
    try {
      const reflections = reflectionStorage.getAll()
      set({ reflections, isLoading: false })
    } catch (error) {
      console.error('Error loading reflections:', error)
      set({ isLoading: false })
    }
  },

  upsertReflection: (date: string, text: string) => {
    const reflection = reflectionStorage.upsert(date, text)
    set((state) => {
      const existingIndex = state.reflections.findIndex((r) => r.date === date)
      if (existingIndex >= 0) {
        // Update existing reflection
        const newReflections = [...state.reflections]
        newReflections[existingIndex] = reflection
        return { reflections: newReflections }
      } else {
        // Add new reflection
        return { reflections: [...state.reflections, reflection] }
      }
    })
    return reflection
  },

  deleteReflection: (date: string) => {
    reflectionStorage.delete(date)
    set((state) => ({
      reflections: state.reflections.filter((r) => r.date !== date),
    }))
  },

  getReflectionByDate: (date: string) => {
    return get().reflections.find((r) => r.date === date)
  },

  getTodayReflection: () => {
    const today = new Date().toISOString().split('T')[0]
    return get().getReflectionByDate(today)
  },
}))
