import { create } from 'zustand'
import { Habit, CreateHabitInput, UpdateHabitInput } from '../types'
import { habitStorage } from '../utils/storage'

interface HabitStore {
  habits: Habit[]
  isLoading: boolean
  
  // Actions
  loadHabits: () => void
  createHabit: (input: CreateHabitInput) => Habit
  updateHabit: (input: UpdateHabitInput) => Habit
  deleteHabit: (id: string) => void
  getHabitById: (id: string) => Habit | undefined
}

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],
  isLoading: false,

  loadHabits: () => {
    set({ isLoading: true })
    try {
      const habits = habitStorage.getAll()
      set({ habits, isLoading: false })
    } catch (error) {
      console.error('Error loading habits:', error)
      set({ isLoading: false })
    }
  },

  createHabit: (input: CreateHabitInput) => {
    const newHabit = habitStorage.create(input)
    set((state) => ({
      habits: [...state.habits, newHabit],
    }))
    return newHabit
  },

  updateHabit: (input: UpdateHabitInput) => {
    const updatedHabit = habitStorage.update(input)
    set((state) => ({
      habits: state.habits.map((h) => (h.id === updatedHabit.id ? updatedHabit : h)),
    }))
    return updatedHabit
  },

  deleteHabit: (id: string) => {
    habitStorage.delete(id)
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
    }))
  },

  getHabitById: (id: string) => {
    return get().habits.find((h) => h.id === id)
  },
}))
