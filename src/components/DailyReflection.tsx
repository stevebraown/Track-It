import { useState, useEffect } from 'react'
import Card from './Card'
import { Check } from 'lucide-react'

interface DailyReflectionProps {
  date: string
  initialText: string
  onSave: (text: string) => void
}

export default function DailyReflection({ date, initialText, onSave }: DailyReflectionProps) {
  const [text, setText] = useState(initialText)
  const [isSaving, setIsSaving] = useState(false)

  // Update local state when initialText changes (e.g., when date changes)
  useEffect(() => {
    setText(initialText)
  }, [initialText, date])

  const handleSave = () => {
    setIsSaving(true)
    onSave(text)
    // Reset saving state after a brief delay for visual feedback
    setTimeout(() => setIsSaving(false), 300)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Save on Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <Card className="animate-fade-in">
      <h3 className="text-h3 mb-4 font-semibold">Daily Reflection</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder="How did today go? What did you learn? What are you grateful for?"
        rows={6}
        className="w-full px-3 py-2 rounded-8 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
      />
      <div className="flex items-center justify-between mt-2">
        <p className="text-small text-[var(--text-secondary)]">
          Auto-saves when you click away. Press Ctrl/Cmd + Enter to save.
        </p>
        {isSaving && (
          <span className="text-small text-success font-medium animate-fade-in flex items-center gap-1">
            <Check className="w-4 h-4" />
            Saved
          </span>
        )}
      </div>
    </Card>
  )
}
