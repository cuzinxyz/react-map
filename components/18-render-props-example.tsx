"use client"

import type React from "react"

import { useState, type ReactNode } from "react"

// Mouse tracker with render props
interface MousePosition {
  x: number
  y: number
}

function MouseTracker({
  children,
}: {
  children: (mouse: MousePosition) => ReactNode
}) {
  const [mouse, setMouse] = useState<MousePosition>({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    setMouse({ x: e.clientX, y: e.clientY })
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="h-32 bg-blue-50 border-2 border-dashed border-blue-300 rounded p-4 cursor-crosshair"
    >
      {children(mouse)}
    </div>
  )
}

// Toggle component with render props
function Toggle({
  children,
  defaultOn = false,
}: {
  children: (props: { on: boolean; toggle: () => void }) => ReactNode
  defaultOn?: boolean
}) {
  const [on, setOn] = useState(defaultOn)

  const toggle = () => setOn((prev) => !prev)

  return <>{children({ on, toggle })}</>
}

// Data fetcher with render props
function DataFetcher<T>({
  url,
  children,
}: {
  url: string
  children: (props: {
    data: T | null
    loading: boolean
    error: string | null
    refetch: () => void
  }) => ReactNode
}) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  useState(() => {
    fetchData()
  })

  return <>{children({ data, loading, error, refetch: fetchData })}</>
}

// Form validation with render props
interface FormState {
  values: Record<string, any>
  errors: Record<string, string>
  touched: Record<string, boolean>
}

interface FormActions {
  setValue: (name: string, value: any) => void
  setError: (name: string, error: string) => void
  setTouched: (name: string) => void
  reset: () => void
  validate: () => boolean
}

function FormProvider({
  initialValues = {},
  validationRules = {},
  children,
}: {
  initialValues?: Record<string, any>
  validationRules?: Record<string, (value: any) => string | undefined>
  children: (props: { state: FormState; actions: FormActions }) => ReactNode
}) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const setValue = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const setError = (name: string, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const setTouchedField = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    Object.keys(validationRules).forEach((field) => {
      const rule = validationRules[field]
      const error = rule(values[field])
      if (error) {
        newErrors[field] = error
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const state: FormState = { values, errors, touched }
  const actions: FormActions = {
    setValue,
    setError,
    setTouched: setTouchedField,
    reset,
    validate,
  }

  return <>{children({ state, actions })}</>
}

// Counter with render props
function Counter({
  initialValue = 0,
  children,
}: {
  initialValue?: number
  children: (props: {
    count: number
    increment: () => void
    decrement: () => void
    reset: () => void
  }) => ReactNode
}) {
  const [count, setCount] = useState(initialValue)

  const increment = () => setCount((prev) => prev + 1)
  const decrement = () => setCount((prev) => prev - 1)
  const reset = () => setCount(initialValue)

  return <>{children({ count, increment, decrement, reset })}</>
}

// Window size tracker with render props
function WindowSizeTracker({
  children,
}: {
  children: (size: { width: number; height: number }) => ReactNode
}) {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useState(() => {
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }

    if (typeof window !== "undefined") {
      updateSize()
      window.addEventListener("resize", updateSize)
      return () => window.removeEventListener("resize", updateSize)
    }
  })

  return <>{children(size)}</>
}

export default function RenderPropsExample() {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">18. Render Props Pattern</h3>
      <div className="space-y-4">
        {/* Mouse tracker */}
        <div className="p-3 bg-blue-50 rounded">
          <h4 className="font-medium mb-2">Mouse Tracker</h4>
          <MouseTracker>
            {({ x, y }) => (
              <div>
                <p className="text-sm">
                  Mouse position: ({x}, {y})
                </p>
                <div
                  className="w-4 h-4 bg-blue-500 rounded-full absolute pointer-events-none"
                  style={{
                    left: x - 8,
                    top: y - 8,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>
            )}
          </MouseTracker>
          <p className="text-xs text-gray-600 mt-2">Move your mouse in the area above</p>
        </div>

        {/* Toggle component */}
        <div className="p-3 bg-green-50 rounded">
          <h4 className="font-medium mb-2">Toggle Component</h4>
          <Toggle defaultOn={false}>
            {({ on, toggle }) => (
              <div className="space-y-2">
                <button
                  onClick={toggle}
                  className={`px-3 py-1 rounded text-sm ${on ? "bg-green-500 text-white" : "bg-gray-200"}`}
                >
                  {on ? "ON" : "OFF"}
                </button>
                {on && (
                  <div className="p-2 bg-white rounded border">
                    <p className="text-sm">This content is visible when toggle is ON!</p>
                  </div>
                )}
              </div>
            )}
          </Toggle>
        </div>

        {/* Data fetcher */}
        <div className="p-3 bg-yellow-50 rounded">
          <h4 className="font-medium mb-2">Data Fetcher</h4>
          <DataFetcher<{ title: string; body: string }> url="https://jsonplaceholder.typicode.com/posts/1">
            {({ data, loading, error, refetch }) => (
              <div className="space-y-2">
                {loading && <p className="text-sm">Loading...</p>}
                {error && <div className="p-2 bg-red-100 rounded text-sm text-red-600">Error: {error}</div>}
                {data && (
                  <div className="p-2 bg-white rounded border">
                    <h5 className="font-medium text-sm">{data.title}</h5>
                    <p className="text-xs text-gray-600">{data.body}</p>
                  </div>
                )}
                <button onClick={refetch} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">
                  Refetch
                </button>
              </div>
            )}
          </DataFetcher>
        </div>

        {/* Form provider */}
        <div className="p-3 bg-purple-50 rounded">
          <h4 className="font-medium mb-2">Form Provider</h4>
          <FormProvider
            initialValues={{ name: "", email: "", age: "" }}
            validationRules={{
              name: (value) => (!value ? "Name is required" : undefined),
              email: (value) => {
                if (!value) return "Email is required"
                if (!/\S+@\S+\.\S+/.test(value)) return "Email is invalid"
                return undefined
              },
              age: (value) => {
                if (!value) return "Age is required"
                if (isNaN(value) || value < 18) return "Must be 18 or older"
                return undefined
              },
            }}
          >
            {({ state, actions }) => (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (actions.validate()) {
                    alert("Form is valid!")
                  }
                }}
                className="space-y-3"
              >
                <div>
                  <input
                    type="text"
                    value={state.values.name || ""}
                    onChange={(e) => actions.setValue("name", e.target.value)}
                    onBlur={() => actions.setTouched("name")}
                    placeholder="Name"
                    className={`w-full px-2 py-1 border rounded text-sm ${
                      state.errors.name && state.touched.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {state.errors.name && state.touched.name && (
                    <p className="text-red-500 text-xs mt-1">{state.errors.name}</p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    value={state.values.email || ""}
                    onChange={(e) => actions.setValue("email", e.target.value)}
                    onBlur={() => actions.setTouched("email")}
                    placeholder="Email"
                    className={`w-full px-2 py-1 border rounded text-sm ${
                      state.errors.email && state.touched.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {state.errors.email && state.touched.email && (
                    <p className="text-red-500 text-xs mt-1">{state.errors.email}</p>
                  )}
                </div>

                <div>
                  <input
                    type="number"
                    value={state.values.age || ""}
                    onChange={(e) => actions.setValue("age", e.target.value)}
                    onBlur={() => actions.setTouched("age")}
                    placeholder="Age"
                    className={`w-full px-2 py-1 border rounded text-sm ${
                      state.errors.age && state.touched.age ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {state.errors.age && state.touched.age && (
                    <p className="text-red-500 text-xs mt-1">{state.errors.age}</p>
                  )}
                </div>

                <div className="space-x-2">
                  <button type="submit" className="px-3 py-1 bg-purple-500 text-white rounded text-sm">
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={actions.reset}
                    className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                  >
                    Reset
                  </button>
                </div>
              </form>
            )}
          </FormProvider>
        </div>

        {/* Counter */}
        <div className="p-3 bg-pink-50 rounded">
          <h4 className="font-medium mb-2">Counter</h4>
          <Counter initialValue={10}>
            {({ count, increment, decrement, reset }) => (
              <div className="space-y-2">
                <p className="text-sm">Count: {count}</p>
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
            )}
          </Counter>
        </div>

        {/* Window size tracker */}
        <div className="p-3 bg-indigo-50 rounded">
          <h4 className="font-medium mb-2">Window Size Tracker</h4>
          <WindowSizeTracker>
            {({ width, height }) => (
              <div className="text-sm">
                <p>
                  Window size: {width} x {height}
                </p>
                <p>Aspect ratio: {(width / height).toFixed(2)}</p>
                <p>Screen type: {width < 768 ? "Mobile" : width < 1024 ? "Tablet" : "Desktop"}</p>
              </div>
            )}
          </WindowSizeTracker>
        </div>

        {/* Render props best practices */}
        <div className="p-3 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">Render Props Best Practices</h4>
          <div className="text-sm space-y-1">
            <p>
              <strong>✅ Good use cases:</strong>
            </p>
            <p>• Sharing stateful logic between components</p>
            <p>• Flexible component composition</p>
            <p>• When you need different UI for same logic</p>
            <p>• Data fetching patterns</p>

            <p className="mt-2">
              <strong>✅ Advantages:</strong>
            </p>
            <p>• More flexible than HOCs</p>
            <p>• Clear data flow</p>
            <p>• Easy to compose</p>
            <p>• TypeScript friendly</p>

            <p className="mt-2">
              <strong>❌ Disadvantages:</strong>
            </p>
            <p>• Can create "wrapper hell"</p>
            <p>• More verbose than hooks</p>
            <p>• Performance considerations with inline functions</p>

            <p className="mt-2">
              <strong>🔄 Modern alternative:</strong>
            </p>
            <p>• Custom hooks (preferred for most cases)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
