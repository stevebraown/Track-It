/**
 * Notification utilities for habit reminders
 */

export interface NotificationPermission {
  granted: boolean
  denied: boolean
  default: boolean
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications')
    return { granted: false, denied: false, default: false }
  }

  if (Notification.permission === 'granted') {
    return { granted: true, denied: false, default: false }
  }

  if (Notification.permission === 'denied') {
    return { granted: false, denied: true, default: false }
  }

  // Permission is 'default', request it
  const permission = await Notification.requestPermission()

  return {
    granted: permission === 'granted',
    denied: permission === 'denied',
    default: permission === 'default',
  }
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) {
    return { granted: false, denied: false, default: false }
  }

  return {
    granted: Notification.permission === 'granted',
    denied: Notification.permission === 'denied',
    default: Notification.permission === 'default',
  }
}

/**
 * Schedule a local notification
 * Note: Browser notifications have limitations - they can't be scheduled far in advance
 * This will show a notification immediately (for testing) or use the Notification API
 */
export async function scheduleNotification(
  title: string,
  options: NotificationOptions
): Promise<void> {
  const permission = getNotificationPermission()

  if (!permission.granted) {
    console.warn('Notification permission not granted')
    return
  }

  // Register service worker if available
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready
      await registration.showNotification(title, {
        ...options,
        badge: '/icon-192.png',
        icon: '/icon-192.png',
        tag: options.tag || 'habit-reminder',
        requireInteraction: false,
        silent: false,
      })
    } catch (error) {
      console.error('Error showing notification via service worker:', error)
      // Fallback to regular notification
      new Notification(title, options)
    }
  } else {
    // Fallback to regular notification
    new Notification(title, options)
  }
}

/**
 * Cancel a scheduled notification by tag
 */
export async function cancelNotification(tag: string): Promise<void> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready
      const notifications = await registration.getNotifications({ tag })
      notifications.forEach((notification) => notification.close())
    } catch (error) {
      console.error('Error canceling notification:', error)
    }
  }
}

/**
 * Check if notifications are supported
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window
}

/**
 * Check if service worker is supported
 */
export function isServiceWorkerSupported(): boolean {
  return 'serviceWorker' in navigator
}
