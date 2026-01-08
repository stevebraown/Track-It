import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { initializeStores } from './stores'
import Layout from './components/Layout'
import ReminderChecker from './components/ReminderChecker'
import Today from './pages/Today'
import Habits from './pages/Habits'
import History from './pages/History'
import Settings from './pages/Settings'

function App() {
  // Initialize all stores on app mount
  useEffect(() => {
    initializeStores()
  }, [])

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <ReminderChecker />
          <Routes>
            <Route path="/" element={<Today />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
