"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"

// Custom hook for local storage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key)
        return item ? JSON.parse(item) : initialValue
      }
      return initialValue
    } catch (error) {
      console.error("Error reading localStorage:", error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error("Error setting localStorage:", error)
    }
  }

  return [storedValue, setValue] as const
}

// Custom hook for fetch data
function useFetch<T>(url: string) {
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
  }, [url])

  return { data, loading, error }
}

// Custom hook for debounced value
function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Custom hook for previous value
function usePrevious<T>(value: T) {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

// Custom hook for toggle
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => setValue((v) => !v), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])

  return { value, toggle, setTrue, setFalse }
}

// Custom hook for counter
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)

  const increment = useCallback(() => setCount((c) => c + 1), [])
  const decrement = useCallback(() => setCount((c) => c - 1), [])
  const reset = useCallback(() => setCount(initialValue), [initialValue])
  const set = useCallback((value: number) => setCount(value), [])

  return { count, increment, decrement, reset, set }
}

// Custom hook for window size
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    if (typeof window !== "undefined") {
      handleResize()
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  return windowSize
}

// Custom hook for online status
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
    }

    function handleOffline() {
      setIsOnline(false)
    }

    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine)
      window.addEventListener("online", handleOnline)
      window.addEventListener("offline", handleOffline)

      return () => {
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
      }
    }
  }, [])

  return isOnline
}

// Custom hook for form handling
function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})

  const handleChange = (name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const setError = (name: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
  }

  return {
    values,
    errors,
    handleChange,
    setError,
    reset,
  }
}

export default function CustomHooksExample() {
  // Using custom hooks
  const [name, setName] = useLocalStorage("user-name", "")
  const [theme, setTheme] = useLocalStorage("theme", "light")

  const { data: posts, loading, error } = useFetch<any[]>("https://jsonplaceholder.typicode.com/posts?_limit=3")

  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const previousSearchTerm = usePrevious(debouncedSearchTerm)

  const { value: isVisible, toggle: toggleVisibility } = useToggle(true)
  const { count, increment, decrement, reset } = useCounter(0)

  const windowSize = useWindowSize()
  const isOnline = useOnlineStatus()

  const {
    values,
    errors,
    handleChange,
    setError,
    reset: resetForm,
  } = useForm({
    email: "",
    message: "",
  })

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple validation
    if (!values.email) {
      setError("email", "Email is required")
      return
    }
    if (!values.message) {
      setError("message", "Message is required")
      return
    }

    alert("Form submitted!")
    resetForm()
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">12. Custom Hooks Example</h3>
      <div className="space-y-4">
        {/* useLocalStorage */}
        <div className="p-3 bg-blue-50 rounded">
          <h4 className="font-medium mb-2">useLocalStorage Hook</h4>
          <div className="space-y-2">
            <div>
              <label className="block text-sm mb-1">Name (saved to localStorage):</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="px-2 py-1 border rounded text-sm w-full"
              />
              <p className="text-xs text-gray-600 mt-1">Refresh page to see persistence</p>
            </div>

            <div>
              <label className="block text-sm mb-1">Theme:</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
              <p className="text-sm mt-1">Current theme: {theme}</p>
            </div>
          </div>
        </div>

        {/* useFetch */}
        <div className="p-3 bg-green-50 rounded">
          <h4 className="font-medium mb-2">useFetch Hook</h4>
          {loading && <p className="text-sm">Loading posts...</p>}
          {error && <p className="text-sm text-red-600">Error: {error}</p>}
          {posts && (
            <div className="space-y-2">
              {posts.map((post) => (
                <div key={post.id} className="p-2 bg-white rounded border text-sm">
                  <h5 className="font-medium">{post.title}</h5>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* useDebounce & usePrevious */}
        <div className="p-3 bg-yellow-50 rounded">
          <h4 className="font-medium mb-2">useDebounce & usePrevious Hooks</h4>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type to search (debounced)"
            className="px-2 py-1 border rounded text-sm w-full mb-2"
          />
          <div className="text-sm space-y-1">
            <p>Search term: {searchTerm}</p>
            <p>Debounced (500ms): {debouncedSearchTerm}</p>
            <p>Previous debounced: {previousSearchTerm || "None"}</p>
          </div>
        </div>

        {/* useToggle */}
        <div className="p-3 bg-purple-50 rounded">
          <h4 className="font-medium mb-2">useToggle Hook</h4>
          <button onClick={toggleVisibility} className="px-3 py-1 bg-purple-500 text-white rounded text-sm mb-2">
            {isVisible ? "Hide" : "Show"} Content
          </button>
          {isVisible && (
            <div className="p-2 bg-white rounded border text-sm">This content is toggled using useToggle hook!</div>
          )}
        </div>

        {/* useCounter */}
        <div className="p-3 bg-pink-50 rounded">
          <h4 className="font-medium mb-2">useCounter Hook</h4>
          <p className="text-sm mb-2">Count: {count}</p>
          <div className="space-x-2">
            <button onClick={increment} className="px-2 py-1 bg-green-500 text-white rounded text-sm">
              +
            </button>
            <button onClick={decrement} className="px-2 py-1 bg-red-500 text-white rounded text-sm">
              -
            </button>
            <button onClick={reset} className="px-2 py-1 bg-gray-500 text-white rounded text-sm">
              Reset
            </button>
          </div>
        </div>

        {/* useWindowSize & useOnlineStatus */}
        <div className="p-3 bg-indigo-50 rounded">
          <h4 className="font-medium mb-2">useWindowSize & useOnlineStatus Hooks</h4>
          <div className="text-sm space-y-1">
            <p>
              Window size: {windowSize.width} x {windowSize.height}
            </p>
            <p>Online status: {isOnline ? "🟢 Online" : "🔴 Offline"}</p>
            <p className="text-xs text-gray-600">Try resizing window or going offline</p>
          </div>
        </div>

        {/* useForm */}
        <div className="p-3 bg-orange-50 rounded">
          <h4 className="font-medium mb-2">useForm Hook</h4>
          <form onSubmit={handleFormSubmit} className="space-y-2">
            <div>
              <input
                type="email"
                value={values.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Email"
                className={`px-2 py-1 border rounded text-sm w-full ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            <div>
              <textarea
                value={values.message}
                onChange={(e) => handleChange("message", e.target.value)}
                placeholder="Message"
                rows={2}
                className={`px-2 py-1 border rounded text-sm w-full ${
                  errors.message ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.message && <p className="text-red-500 text-xs">{errors.message}</p>}
            </div>

            <div className="space-x-2">
              <button type="submit" className="px-3 py-1 bg-orange-500 text-white rounded text-sm">
                Submit
              </button>
              <button type="button" onClick={resetForm} className="px-3 py-1 bg-gray-500 text-white rounded text-sm">
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Custom hooks benefits */}
        <div className="p-3 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">Custom Hooks Benefits</h4>
          <div className="text-sm space-y-1">
            <p>✅ Reusable stateful logic</p>
            <p>✅ Cleaner components</p>
            <p>✅ Easier testing</p>
            <p>✅ Better separation of concerns</p>
            <p>✅ Share logic between components</p>
          </div>
        </div>
      </div>
    </div>
  )
}
