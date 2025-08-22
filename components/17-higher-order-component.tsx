"use client"

import { useState, useEffect, type ComponentType } from "react"

// HOC for adding loading state
function withLoading<P extends object>(WrappedComponent: ComponentType<P>, loadingMessage = "Loading...") {
  return function WithLoadingComponent(props: P & { isLoading?: boolean }) {
    const { isLoading, ...restProps } = props

    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-4 bg-blue-50 rounded">
          <div className="text-blue-600">{loadingMessage}</div>
        </div>
      )
    }

    return <WrappedComponent {...(restProps as P)} />
  }
}

// HOC for authentication
function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  return function WithAuthComponent(props: P & { isAuthenticated?: boolean }) {
    const { isAuthenticated, ...restProps } = props

    if (!isAuthenticated) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h4 className="font-medium text-red-800 mb-2">Access Denied</h4>
          <p className="text-sm text-red-600">You must be logged in to view this content.</p>
        </div>
      )
    }

    return <WrappedComponent {...(restProps as P)} />
  }
}

// HOC for error boundary
function withErrorBoundary<P extends object>(WrappedComponent: ComponentType<P>) {
  return function WithErrorBoundaryComponent(props: P) {
    const [hasError, setHasError] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
      const handleError = (event: ErrorEvent) => {
        setHasError(true)
        setError(new Error(event.message))
      }

      window.addEventListener("error", handleError)
      return () => window.removeEventListener("error", handleError)
    }, [])

    if (hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h4 className="font-medium text-red-800 mb-2">Something went wrong</h4>
          <p className="text-sm text-red-600">{error?.message}</p>
          <button
            onClick={() => {
              setHasError(false)
              setError(null)
            }}
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm"
          >
            Try Again
          </button>
        </div>
      )
    }

    return <WrappedComponent {...props} />
  }
}

// HOC for analytics tracking
function withAnalytics<P extends object>(WrappedComponent: ComponentType<P>, eventName: string) {
  return function WithAnalyticsComponent(props: P) {
    useEffect(() => {
      console.log(`📊 Analytics: ${eventName} component mounted`)

      return () => {
        console.log(`📊 Analytics: ${eventName} component unmounted`)
      }
    }, [])

    const handleClick = (originalHandler?: () => void) => {
      console.log(`📊 Analytics: ${eventName} clicked`)
      originalHandler?.()
    }

    return (
      <div onClick={() => handleClick()}>
        <WrappedComponent {...props} />
      </div>
    )
  }
}

// HOC for theme injection
interface ThemeProps {
  theme: {
    primary: string
    secondary: string
    background: string
    text: string
  }
}

function withTheme<P extends object>(WrappedComponent: ComponentType<P & ThemeProps>) {
  return function WithThemeComponent(props: P & { darkMode?: boolean }) {
    const { darkMode, ...restProps } = props

    const theme = {
      primary: darkMode ? "#3B82F6" : "#1D4ED8",
      secondary: darkMode ? "#10B981" : "#059669",
      background: darkMode ? "#1F2937" : "#FFFFFF",
      text: darkMode ? "#F9FAFB" : "#111827",
    }

    return <WrappedComponent {...(restProps as P)} theme={theme} />
  }
}

// HOC for data fetching
function withDataFetching<P extends object, T = any>(
  WrappedComponent: ComponentType<P & { data: T; loading: boolean; error: string | null }>,
  url: string,
) {
  return function WithDataFetchingComponent(props: P) {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true)
          setError(null)
          const response = await fetch(url)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const result = await response.json()
          setData(result)
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
          setLoading(false)
        }
      }

      fetchData()
    }, [])

    return <WrappedComponent {...props} data={data} loading={loading} error={error} />
  }
}

// Base components to be enhanced with HOCs
function UserProfile({ name, email }: { name: string; email: string }) {
  return (
    <div className="p-3 bg-white border rounded">
      <h4 className="font-medium">{name}</h4>
      <p className="text-sm text-gray-600">{email}</p>
    </div>
  )
}

function Dashboard() {
  return (
    <div className="p-4 bg-green-50 rounded">
      <h4 className="font-medium text-green-800 mb-2">Dashboard</h4>
      <p className="text-sm text-green-600">Welcome to your dashboard!</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="p-2 bg-white rounded text-xs">Widget 1</div>
        <div className="p-2 bg-white rounded text-xs">Widget 2</div>
      </div>
    </div>
  )
}

function ThemedComponent({ theme }: ThemeProps) {
  return (
    <div
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        border: `2px solid ${theme.primary}`,
      }}
      className="p-3 rounded"
    >
      <h4 className="font-medium">Themed Component</h4>
      <p className="text-sm">Primary: {theme.primary}</p>
      <p className="text-sm">Background: {theme.background}</p>
    </div>
  )
}

function DataDisplay({
  data,
  loading,
  error,
}: {
  data: any
  loading: boolean
  error: string | null
}) {
  if (error) {
    return <div className="text-red-600 text-sm">Error: {error}</div>
  }

  return (
    <div className="p-3 bg-blue-50 rounded">
      <h4 className="font-medium text-blue-800 mb-2">Fetched Data</h4>
      {data && (
        <div className="text-sm">
          <p>Title: {data.title}</p>
          <p>Body: {data.body?.substring(0, 100)}...</p>
        </div>
      )}
    </div>
  )
}

// Enhanced components using HOCs
const LoadingUserProfile = withLoading(UserProfile, "Loading user profile...")
const AuthenticatedDashboard = withAuth(Dashboard)
const SafeDashboard = withErrorBoundary(Dashboard)
const AnalyticsDashboard = withAnalytics(Dashboard, "Dashboard")
const ThemedComponentWithTheme = withTheme(ThemedComponent)
const DataDisplayWithFetching = withDataFetching(DataDisplay, "https://jsonplaceholder.typicode.com/posts/1")

// Composing multiple HOCs
const EnhancedUserProfile = withAnalytics(
  withLoading(withAuth(UserProfile), "Loading secure profile..."),
  "UserProfile",
)

export default function HigherOrderComponent() {
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const simulateLoading = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">17. Higher-Order Components (HOC)</h3>
      <div className="space-y-4">
        {/* Controls */}
        <div className="p-3 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">Controls</h4>
          <div className="space-x-2 mb-2">
            <button onClick={simulateLoading} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
              Simulate Loading
            </button>
            <button
              onClick={() => setIsAuthenticated(!isAuthenticated)}
              className={`px-3 py-1 rounded text-sm ${
                isAuthenticated ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {isAuthenticated ? "Logout" : "Login"}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-3 py-1 rounded text-sm ${darkMode ? "bg-gray-800 text-white" : "bg-gray-200"}`}
            >
              {darkMode ? "Light" : "Dark"} Mode
            </button>
          </div>
          <p className="text-xs text-gray-600">Check console for analytics logs</p>
        </div>

        {/* withLoading HOC */}
        <div className="p-3 bg-blue-50 rounded">
          <h4 className="font-medium mb-2">withLoading HOC</h4>
          <LoadingUserProfile name="John Doe" email="john@example.com" isLoading={isLoading} />
        </div>

        {/* withAuth HOC */}
        <div className="p-3 bg-green-50 rounded">
          <h4 className="font-medium mb-2">withAuth HOC</h4>
          <AuthenticatedDashboard isAuthenticated={isAuthenticated} />
        </div>

        {/* withTheme HOC */}
        <div className="p-3 bg-purple-50 rounded">
          <h4 className="font-medium mb-2">withTheme HOC</h4>
          <ThemedComponentWithTheme darkMode={darkMode} />
        </div>

        {/* withDataFetching HOC */}
        <div className="p-3 bg-yellow-50 rounded">
          <h4 className="font-medium mb-2">withDataFetching HOC</h4>
          <DataDisplayWithFetching />
        </div>

        {/* withAnalytics HOC */}
        <div className="p-3 bg-pink-50 rounded">
          <h4 className="font-medium mb-2">withAnalytics HOC</h4>
          <AnalyticsDashboard />
          <p className="text-xs text-gray-600 mt-2">Click anywhere on the component to see analytics logs</p>
        </div>

        {/* Composed HOCs */}
        <div className="p-3 bg-orange-50 rounded">
          <h4 className="font-medium mb-2">Composed HOCs (Auth + Loading + Analytics)</h4>
          <EnhancedUserProfile
            name="Jane Smith"
            email="jane@example.com"
            isAuthenticated={isAuthenticated}
            isLoading={isLoading}
          />
        </div>

        {/* HOC Patterns and Best Practices */}
        <div className="p-3 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">HOC Best Practices</h4>
          <div className="text-sm space-y-1">
            <p>
              <strong>✅ Good use cases:</strong>
            </p>
            <p>• Cross-cutting concerns (auth, logging, theming)</p>
            <p>• Code reuse across multiple components</p>
            <p>• Conditional rendering logic</p>
            <p>• Data fetching patterns</p>

            <p className="mt-2">
              <strong>❌ Avoid HOCs for:</strong>
            </p>
            <p>• Simple prop manipulation (use regular functions)</p>
            <p>• One-time use cases (create custom hooks instead)</p>
            <p>• Complex prop transformations (prefer render props)</p>

            <p className="mt-2">
              <strong>⚠️ Modern alternatives:</strong>
            </p>
            <p>• Custom hooks (preferred for stateful logic)</p>
            <p>• Render props (for flexible component composition)</p>
            <p>• Context API (for global state)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
