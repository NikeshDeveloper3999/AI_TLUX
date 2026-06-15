import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { ServerUrl } from '../App'

const ThemeContext = createContext()

export function ThemeProvider({ children, user }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('siteTheme') || 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('siteTheme', theme)
  }, [theme])

  useEffect(() => {
    if (user?.siteTheme && user.siteTheme !== theme) {
      setThemeState(user.siteTheme)
    }
  }, [user?.siteTheme])

  const setTheme = (newTheme) => {
    setThemeState(newTheme)
    if (user) {
      axios.post(ServerUrl + "/api/user/save-site-theme", { siteTheme: newTheme }, { withCredentials: true })
        .catch(() => {})
    }
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
