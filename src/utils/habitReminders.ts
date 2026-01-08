import { Habit } from '../types'
import { getTodayISO, parseDateISO, formatDateISO } from './date'
import { isHabitDueOnDate } from './habit'
import { scheduleNotification, cancelNotification } from './notifications'

/**
 * Schedule a reminder notification for a habit
 * Note: Browser notifications have limitations - we can only schedule immediate notifications
 * For true scheduled notifications, you'd need a backend service or use Web Push API
 */
export async function scheduleHabitReminder(habit: Habit): Promise<void> {
  if (!habit.reminderTime) {
    return
  }

  const today = getTodayISO()
  
  // Check if habit is due today
  if (!isHabitDueOnDate(habit, today)) {
    return
  }

  // Parse reminder time (HH:mm format)
  const [hours, minutes] = habit.reminderTime.split(':').map(Number)
  const now = new Date()
  const reminderTime = new Date()
  reminderTime.setHours(hours, minutes, 0, 0)

  // If reminder time has passed today, schedule for tomorrow
  if (reminderTime < now) {
    reminderTime.setDate(reminderTime.getDate() + 1)
  }

  // Calculate delay in milliseconds
  const delay = reminderTime.getTime() - now.getTime()

  // Browser limitations: we can only show notifications immediately or very soon
  // For a real implementation, you'd need:
  // 1. Web Push API with a backend service
  // 2. Or use a service worker with background sync
  // For now, we'll show a notification immediately if it's close to the reminder time
  // or schedule it with setTimeout (only works while app is open)

  if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
    // Schedule for within 24 hours (only works while app is open)
    setTimeout(() => {
      scheduleNotification(`Time for ${habit.name}!`, {
        body: habit.description || 'Don\'t forget to complete your habit today.',
        tag: `habit-${habit.id}`,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
      })
    }, delay)
  }
}

/**
 * Cancel all reminders for a habit
 */
export async function cancelHabitReminder(habit: Habit): Promise<void> {
  await cancelNotification(`habit-${habit.id}`)
}

/**
 * Check and send reminders for all habits due today
 * This should be called periodically (e.g., on app load, or via service worker)
 */
export async function checkAndSendReminders(habits: Habit[]): Promise<void> {
  const today = getTodayISO()
  const now = new Date()
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

  for (const habit of habits) {
    if (!habit.reminderTime) continue
    if (!isHabitDueOnDate(habit, today)) continue

    // Check if it's time for the reminder (within 1 minute of scheduled time)
    const [hours, minutes] = habit.reminderTime.split(':').map(Number)
    const reminderTime = new Date()
    reminderTime.setHours(hours, minutes, 0, 0)

    const timeDiff = Math.abs(now.getTime() - reminderTime.getTime())
    const oneMinute = 60 * 1000

    if (timeDiff < oneMinute) {
      // It's time for the reminder
      await scheduleNotification(`Time for ${habit.name}!`, {
        body: habit.description || 'Don\'t forget to complete your habit today.',
        tag: `habit-${habit.id}-${today}`,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
      })
    }
  }
}
