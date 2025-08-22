"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Theme Context
interface ThemeContextType {
  theme: "light" | "dark"
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// User Context
interface User {
  id: number
  name: string
  email: string
  role: "admin" | "user"
}

interface UserContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Settings Context
interface Settings {
  language: string
  notifications: boolean
  autoSave: boolean
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

// Theme Provider
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

// User Provider
function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (userData: User) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
  }

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>
}

// Settings Provider
function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    language: "en",
    notifications: true,
    autoSave: false,
  })

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  return <SettingsContext.Provider value={{ settings, updateSettings }}>{children}</SettingsContext.Provider>
}

// Custom hooks for using contexts
function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}

// Header component that uses multiple contexts
function Header() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useUser()

  return (
    <div
      className={`p-3 rounded border ${
        theme === "dark" ? "bg-gray-800 text-white border-gray-700" : "bg-white border-gray-300"
      }`}
    >
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Header Component</h4>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`px-2 py-1 rounded text-xs ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
          >
            {theme === "dark" ? "☀️" : "🌙"} {theme}
          </button>
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm">Hello, {user.name}</span>
              <button onClick={logout} className="px-2 py-1 bg-red-500 text-white rounded text-xs">
                Logout
              </button>
            </div>
          ) : (
            <span className="text-sm">Not logged in</span>
          )}
        </div>
      </div>
    </div>
  )
}

// User profile component
function UserProfile() {
  const { user, login } = useUser()
  const { theme } = useTheme()

  const handleLogin = () => {
    login({
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
    })
  }

  return (
    <div
      className={`p-3 rounded border ${
        theme === "dark" ? "bg-gray-800 text-white border-gray-700" : "bg-white border-gray-300"
      }`}
    >
      <h4 className="font-medium mb-2">User Profile</h4>
      {user ? (
        <div className="text-sm space-y-1">
          <p>ID: {user.id}</p>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      ) : (
        <div>
          <p className="text-sm mb-2">No user logged in</p>
          <button onClick={handleLogin} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
            Login as John
          </button>
        </div>
      )}
    </div>
  )
}

// Settings component
function SettingsPanel() {
  const { settings, updateSettings } = useSettings()
  const { theme } = useTheme()

  return (
    <div
      className={`p-3 rounded border ${
        theme === "dark" ? "bg-gray-800 text-white border-gray-700" : "bg-white border-gray-300"
      }`}
    >
      <h4 className="font-medium mb-2">Settings Panel</h4>
      <div className="space-y-2">
        <div>
          <label className="block text-sm mb-1">Language</label>
          <select
            value={settings.language}
            onChange={(e) => updateSettings({ language: e.target.value })}
            className={`px-2 py-1 border rounded text-sm ${
              theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
            }`}
          >
            <option value="en">English</option>
            <option value="vi">Vietnamese</option>
            <option value="es">Spanish</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => updateSettings({ notifications: e.target.checked })}
              className="mr-2"
            />
            Enable Notifications
          </label>

          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => updateSettings({ autoSave: e.target.checked })}
              className="mr-2"
            />
            Auto Save
          </label>
        </div>
      </div>
    </div>
  )
}

// Context consumer component
function ContextConsumer() {
  const { theme } = useTheme()
  const { user } = useUser()
  const { settings } = useSettings()

  return (
    <div
      className={`p-3 rounded border ${
        theme === "dark" ? "bg-gray-800 text-white border-gray-700" : "bg-white border-gray-300"
      }`}
    >
      <h4 className="font-medium mb-2">Context Consumer</h4>
      <div className="text-sm space-y-1">
        <p>Theme: {theme}</p>
        <p>User: {user ? user.name : "None"}</p>
        <p>Language: {settings.language}</p>
        <p>Notifications: {settings.notifications ? "On" : "Off"}</p>
        <p>Auto Save: {settings.autoSave ? "On" : "Off"}</p>
      </div>
    </div>
  )
}

// Main component with all providers
export default function UseContextExample() {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">10. useContext Example</h3>

      <ThemeProvider>
        <UserProvider>
          <SettingsProvider>
            <div className="space-y-4">
              <Header />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UserProfile />
                <SettingsPanel />
              </div>

              <ContextConsumer />

              {/* Context explanation */}
              <div className="p-3 bg-gray-50 rounded">
                <h4 className="font-medium mb-2">Context Benefits</h4>
                <div className="text-sm space-y-1">
                  <p>✅ Avoid prop drilling</p>
                  <p>✅ Share state across components</p>
                  <p>✅ Clean component tree</p>
                  <p>✅ Custom hooks for context access</p>
                  <p>⚠️ Use sparingly - can cause unnecessary re-renders</p>
                </div>
              </div>
            </div>
          </SettingsProvider>
        </UserProvider>
      </ThemeProvider>
    </div>
  )
}
