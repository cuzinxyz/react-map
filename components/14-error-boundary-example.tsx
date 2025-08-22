"use client"

import { Component, type ErrorInfo, type ReactNode, useState } from "react"

// Error Boundary Class Component
class ErrorBoundary extends Component<
  {
    children: ReactNode
    fallback?: ReactNode
    onError?: (error: Error, errorInfo: ErrorInfo) => void
  },
  {
    hasError: boolean
    error: Error | null
    errorInfo: ErrorInfo | null
  }
> {
  constructor(props: {
    children: ReactNode
    fallback?: ReactNode
    onError?: (error: Error, errorInfo: ErrorInfo) => void
  }) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error("Error caught by boundary:", error)
    console.error("Error info:", errorInfo)

    this.setState({
      error,
      errorInfo,
    })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
          <details className="mb-3">
            <summary className="cursor-pointer text-sm font-medium text-red-700">Error Details</summary>
            <div className="mt-2 p-2 bg-red-100 rounded text-xs">
              <p>
                <strong>Error:</strong> {this.state.error?.message}
              </p>
              <p>
                <strong>Stack:</strong>
              </p>
              <pre className="whitespace-pre-wrap text-xs">{this.state.error?.stack}</pre>
              {this.state.errorInfo && (
                <>
                  <p>
                    <strong>Component Stack:</strong>
                  </p>
                  <pre className="whitespace-pre-wrap text-xs">{this.state.errorInfo.componentStack}</pre>
                </>
              )}
            </div>
          </details>
          <button onClick={this.handleReset} className="px-3 py-1 bg-red-500 text-white rounded text-sm">
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Component that throws errors
function BuggyComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("This is a simulated error!")
  }

  return (
    <div className="p-3 bg-green-50 rounded">
      <h4 className="font-medium text-green-800">✅ Component working fine!</h4>
      <p className="text-sm text-green-600">No errors here.</p>
    </div>
  )
}

// Component with async error
function AsyncBuggyComponent({ shouldThrow }: { shouldThrow: boolean }) {
  const [asyncError, setAsyncError] = useState(false)

  const triggerAsyncError = () => {
    setTimeout(() => {
      setAsyncError(true)
    }, 1000)
  }

  if (asyncError) {
    throw new Error("This is an async error!")
  }

  return (
    <div className="p-3 bg-blue-50 rounded">
      <h4 className="font-medium text-blue-800">Async Error Component</h4>
      <p className="text-sm text-blue-600 mb-2">This component can throw errors asynchronously.</p>
      <button onClick={triggerAsyncError} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
        Trigger Async Error (1s delay)
      </button>
    </div>
  )
}

// Component with network error simulation
function NetworkErrorComponent({ shouldFail }: { shouldFail: boolean }) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      if (shouldFail) {
        throw new Error("Network request failed!")
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setData({ message: "Data loaded successfully!" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      // This won't be caught by Error Boundary because it's in an async function
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    // Handle error gracefully without throwing
    return (
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
        <h4 className="font-medium text-yellow-800">Network Error</h4>
        <p className="text-sm text-yellow-600">{error}</p>
        <button onClick={fetchData} className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded text-sm">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="p-3 bg-purple-50 rounded">
      <h4 className="font-medium text-purple-800">Network Component</h4>
      {loading ? (
        <p className="text-sm text-purple-600">Loading...</p>
      ) : data ? (
        <p className="text-sm text-purple-600">{data.message}</p>
      ) : (
        <button onClick={fetchData} className="px-3 py-1 bg-purple-500 text-white rounded text-sm">
          Fetch Data
        </button>
      )}
    </div>
  )
}

// Custom fallback component
function CustomErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="p-4 bg-orange-50 border border-orange-200 rounded">
      <h3 className="text-lg font-semibold text-orange-800 mb-2">🚨 Custom Error Fallback</h3>
      <p className="text-sm text-orange-600 mb-3">A custom error occurred: {error.message}</p>
      <button onClick={resetError} className="px-3 py-1 bg-orange-500 text-white rounded text-sm">
        Reset Component
      </button>
    </div>
  )
}

export default function ErrorBoundaryExample() {
  const [throwError1, setThrowError1] = useState(false)
  const [throwError2, setThrowError2] = useState(false)
  const [throwAsyncError, setThrowAsyncError] = useState(false)
  const [networkShouldFail, setNetworkShouldFail] = useState(false)
  const [errorLog, setErrorLog] = useState<string[]>([])

  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    const errorMessage = `${new Date().toLocaleTimeString()}: ${error.message}`
    setErrorLog((prev) => [...prev, errorMessage])
  }

  const clearErrorLog = () => {
    setErrorLog([])
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">14. Error Boundary Example</h3>
      <div className="space-y-4">
        {/* Controls */}
        <div className="p-3 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">Error Controls</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setThrowError1(!throwError1)}
              className={`px-3 py-1 rounded text-sm ${throwError1 ? "bg-red-500 text-white" : "bg-gray-200"}`}
            >
              {throwError1 ? "Fix" : "Break"} Component 1
            </button>
            <button
              onClick={() => setThrowError2(!throwError2)}
              className={`px-3 py-1 rounded text-sm ${throwError2 ? "bg-red-500 text-white" : "bg-gray-200"}`}
            >
              {throwError2 ? "Fix" : "Break"} Component 2
            </button>
            <button
              onClick={() => setThrowAsyncError(!throwAsyncError)}
              className={`px-3 py-1 rounded text-sm ${throwAsyncError ? "bg-red-500 text-white" : "bg-gray-200"}`}
            >
              {throwAsyncError ? "Fix" : "Break"} Async Component
            </button>
            <button
              onClick={() => setNetworkShouldFail(!networkShouldFail)}
              className={`px-3 py-1 rounded text-sm ${networkShouldFail ? "bg-red-500 text-white" : "bg-gray-200"}`}
            >
              {networkShouldFail ? "Fix" : "Break"} Network
            </button>
          </div>
        </div>

        {/* Error Boundary with default fallback */}
        <div>
          <h4 className="font-medium mb-2">Default Error Boundary</h4>
          <ErrorBoundary onError={handleError}>
            <BuggyComponent shouldThrow={throwError1} />
          </ErrorBoundary>
        </div>

        {/* Error Boundary with custom fallback */}
        <div>
          <h4 className="font-medium mb-2">Custom Error Boundary</h4>
          <ErrorBoundary
            fallback={
              <CustomErrorFallback error={new Error("Custom error message")} resetError={() => setThrowError2(false)} />
            }
            onError={handleError}
          >
            <BuggyComponent shouldThrow={throwError2} />
          </ErrorBoundary>
        </div>

        {/* Async Error (not caught by Error Boundary) */}
        <div>
          <h4 className="font-medium mb-2">Async Error (Not Caught by Error Boundary)</h4>
          <ErrorBoundary onError={handleError}>
            <AsyncBuggyComponent shouldThrow={throwAsyncError} />
          </ErrorBoundary>
        </div>

        {/* Network Error (handled gracefully) */}
        <div>
          <h4 className="font-medium mb-2">Network Error (Graceful Handling)</h4>
          <NetworkErrorComponent shouldFail={networkShouldFail} />
        </div>

        {/* Error Log */}
        <div className="p-3 bg-gray-50 rounded">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Error Log</h4>
            <button onClick={clearErrorLog} className="px-2 py-1 bg-gray-500 text-white rounded text-xs">
              Clear
            </button>
          </div>
          {errorLog.length === 0 ? (
            <p className="text-sm text-gray-500">No errors logged yet</p>
          ) : (
            <div className="space-y-1">
              {errorLog.map((error, index) => (
                <div key={index} className="text-xs bg-red-100 p-2 rounded">
                  {error}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error Boundary Best Practices */}
        <div className="p-3 bg-blue-50 rounded">
          <h4 className="font-medium mb-2">Error Boundary Best Practices</h4>
          <div className="text-sm space-y-1">
            <p>✅ Use Error Boundaries to catch JavaScript errors in component tree</p>
            <p>✅ Display fallback UI instead of crashing the entire app</p>
            <p>✅ Log errors for debugging and monitoring</p>
            <p>❌ Error Boundaries do NOT catch:</p>
            <div className="ml-4 space-y-1">
              <p>• Errors in event handlers</p>
              <p>• Errors in async code (setTimeout, promises)</p>
              <p>• Errors during server-side rendering</p>
              <p>• Errors thrown in the Error Boundary itself</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
