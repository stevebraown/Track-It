import { useState } from 'react'
import { exportData, importData, clearAllData } from '../utils/storage'
import { useNotifications } from '../hooks/useNotifications'
import Card from '../components/Card'
import Button from '../components/Button'
import InstallPrompt from '../components/InstallPrompt'

export default function Settings() {
  const { permission, isSupported, requestPermission } = useNotifications()
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState(false)

  const handleExport = () => {
    try {
      const data = exportData()
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `trackit-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export data. Please try again.')
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImportError(null)
    setImportSuccess(false)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string
        importData(data)
        setImportSuccess(true)
        // Reload the page to refresh all stores
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } catch (error) {
        setImportError('Failed to import data. Please check the file format.')
        console.error('Import failed:', error)
      }
    }
    reader.readAsText(file)
  }

  const handleClearData = () => {
    if (
      window.confirm(
        'Are you sure you want to delete all data? This cannot be undone!'
      )
    ) {
      if (
        window.confirm(
          'This will permanently delete all your habits, entries, and reflections. Type "DELETE" to confirm.'
        )
      ) {
        clearAllData()
        window.location.reload()
      }
    }
  }

  const handleRequestNotificationPermission = async () => {
    await requestPermission()
  }

  return (
    <div>
      <h2 className="text-h1 mb-6">Settings</h2>

      {/* Install Prompt */}
      <InstallPrompt />

      {/* Notifications */}
      <Card className="mb-6">
        <h3 className="text-h3 mb-4">Notifications</h3>
        {!isSupported ? (
          <p className="text-body text-[var(--text-secondary)]">
            Notifications are not supported in this browser.
          </p>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-body mb-2">
                Status:{' '}
                <span
                  className={`font-medium ${
                    permission.granted
                      ? 'text-success'
                      : permission.denied
                      ? 'text-destructive'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {permission.granted
                    ? 'Enabled'
                    : permission.denied
                    ? 'Denied'
                    : 'Not requested'}
                </span>
              </p>
              <p className="text-small text-[var(--text-secondary)] mb-4">
                Enable notifications to receive reminders for your habits at their
                scheduled times.
              </p>
            </div>
            {!permission.granted && !permission.denied && (
              <Button
                variant="primary"
                onClick={handleRequestNotificationPermission}
              >
                Enable Notifications
              </Button>
            )}
            {permission.denied && (
              <p className="text-small text-destructive">
                Notifications are blocked. Please enable them in your browser
                settings.
              </p>
            )}
          </div>
        )}
      </Card>

      {/* Data Management */}
      <Card className="mb-6">
        <h3 className="text-h3 mb-4">Data Management</h3>
        <div className="space-y-4">
          {/* Export */}
          <div>
            <h4 className="text-body font-medium mb-2">Export Data</h4>
            <p className="text-small text-[var(--text-secondary)] mb-3">
              Download a backup of all your data (habits, entries, reflections) as
              a JSON file.
            </p>
            <Button variant="primary" onClick={handleExport}>
              Export Data
            </Button>
          </div>

          {/* Import */}
          <div>
            <h4 className="text-body font-medium mb-2">Import Data</h4>
            <p className="text-small text-[var(--text-secondary)] mb-3">
              Restore your data from a previously exported backup file.
            </p>
            <div className="space-y-2">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="block text-small"
                id="import-file"
              />
              {importError && (
                <p className="text-small text-destructive">{importError}</p>
              )}
              {importSuccess && (
                <p className="text-small text-success">
                  Data imported successfully! Reloading...
                </p>
              )}
            </div>
          </div>

          {/* Clear Data */}
          <div>
            <h4 className="text-body font-medium mb-2 text-destructive">
              Clear All Data
            </h4>
            <p className="text-small text-[var(--text-secondary)] mb-3">
              Permanently delete all your data. This action cannot be undone.
            </p>
            <Button variant="destructive" onClick={handleClearData}>
              Clear All Data
            </Button>
          </div>
        </div>
      </Card>

      {/* App Info */}
      <Card>
        <h3 className="text-h3 mb-4">About</h3>
        <div className="space-y-2 text-small text-[var(--text-secondary)]">
          <p>
            <strong>Track It</strong> - A simple, beautiful habit tracker
          </p>
          <p>Version 1.0.0</p>
          <p>
            All data is stored locally on your device. No accounts, no cloud
            sync, complete privacy.
          </p>
        </div>
      </Card>
    </div>
  )
}
