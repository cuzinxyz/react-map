"use client"

import type React from "react"

import {
  useLayoutEffect,
  useImperativeHandle,
  useId,
  useSyncExternalStore,
  forwardRef,
  useState,
  useRef,
  useEffect,
} from "react"

// useLayoutEffect example
function LayoutEffectExample() {
  const [height, setHeight] = useState(0)
  const divRef = useRef<HTMLDivElement>(null)
  const [content, setContent] = useState("Short content")

  // useLayoutEffect runs synchronously after all DOM mutations
  useLayoutEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect()
      setHeight(rect.height)
    }
  }, [content])

  // useEffect would run after paint, causing flicker
  useEffect(() => {
    console.log("useEffect: Height measured after paint")
  }, [height])

  return (
    <div className="p-3 bg-blue-50 rounded">
      <h4 className="font-medium mb-2">useLayoutEffect Example</h4>

      <div className="space-x-2 mb-2">
        <button
          onClick={() => setContent("Short content")}
          className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
        >
          Short
        </button>
        <button
          onClick={() =>
            setContent("This is much longer content that will change the height of the container significantly")
          }
          className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
        >
          Long
        </button>
      </div>

      <div ref={divRef} className="p-3 bg-white border rounded mb-2">
        {content}
      </div>

      <p className="text-sm">Measured height: {height}px (updated synchronously before paint)</p>

      <p className="text-xs text-gray-600 mt-2">
        useLayoutEffect prevents flicker by measuring DOM before browser paint
      </p>
    </div>
  )
}

// useImperativeHandle example
interface CustomInputRef {
  focus: () => void
  blur: () => void
  clear: () => void
  getValue: () => string
  setValue: (value: string) => void
  select: () => void
}

const CustomInput = forwardRef<
  CustomInputRef,
  {
    label: string
    placeholder?: string
    onValueChange?: (value: string) => void
  }
>(function CustomInput({ label, placeholder, onValueChange }, ref) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState("")

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        inputRef.current?.focus()
      },
      blur: () => {
        inputRef.current?.blur()
      },
      clear: () => {
        setValue("")
        onValueChange?.("")
      },
      getValue: () => {
        return value
      },
      setValue: (newValue: string) => {
        setValue(newValue)
        onValueChange?.(newValue)
      },
      select: () => {
        inputRef.current?.select()
      },
    }),
    [value, onValueChange],
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-2 py-1 border rounded text-sm"
      />
    </div>
  )
})

function ImperativeHandleExample() {
  const inputRef = useRef<CustomInputRef>(null)

  return (
    <div className="p-3 bg-green-50 rounded">
      <h4 className="font-medium mb-2">useImperativeHandle Example</h4>

      <CustomInput
        ref={inputRef}
        label="Custom Input"
        placeholder="Type something..."
        onValueChange={(value) => console.log("Value changed:", value)}
      />

      <div className="space-x-2 mt-2">
        <button onClick={() => inputRef.current?.focus()} className="px-2 py-1 bg-green-500 text-white rounded text-sm">
          Focus
        </button>
        <button onClick={() => inputRef.current?.blur()} className="px-2 py-1 bg-gray-500 text-white rounded text-sm">
          Blur
        </button>
        <button onClick={() => inputRef.current?.clear()} className="px-2 py-1 bg-red-500 text-white rounded text-sm">
          Clear
        </button>
        <button onClick={() => inputRef.current?.select()} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">
          Select All
        </button>
        <button
          onClick={() => {
            const value = inputRef.current?.getValue()
            alert(`Current value: ${value}`)
          }}
          className="px-2 py-1 bg-purple-500 text-white rounded text-sm"
        >
          Get Value
        </button>
        <button
          onClick={() => inputRef.current?.setValue("Hello World!")}
          className="px-2 py-1 bg-orange-500 text-white rounded text-sm"
        >
          Set Value
        </button>
      </div>

      <p className="text-xs text-gray-600 mt-2">useImperativeHandle exposes custom methods to parent components</p>
    </div>
  )
}

// useId example
function UseIdExample() {
  const id1 = useId()
  const id2 = useId()
  const id3 = useId()

  return (
    <div className="p-3 bg-yellow-50 rounded">
      <h4 className="font-medium mb-2">useId Example</h4>

      <div className="space-y-3">
        <div>
          <label htmlFor={id1} className="block text-sm font-medium">
            Name (ID: {id1})
          </label>
          <input
            id={id1}
            type="text"
            className="w-full px-2 py-1 border rounded text-sm"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label htmlFor={id2} className="block text-sm font-medium">
            Email (ID: {id2})
          </label>
          <input
            id={id2}
            type="email"
            className="w-full px-2 py-1 border rounded text-sm"
            placeholder="Enter your email"
          />
        </div>

        <fieldset>
          <legend className="text-sm font-medium">Preferences</legend>
          <div className="space-y-1 mt-1">
            <label className="flex items-center text-sm">
              <input id={`${id3}-newsletter`} type="checkbox" className="mr-2" />
              Subscribe to newsletter
            </label>
            <label className="flex items-center text-sm">
              <input id={`${id3}-notifications`} type="checkbox" className="mr-2" />
              Enable notifications
            </label>
          </div>
        </fieldset>
      </div>

      <p className="text-xs text-gray-600 mt-2">useId generates unique IDs for accessibility attributes (SSR-safe)</p>
    </div>
  )
}

// useSyncExternalStore example - Browser online status
function createOnlineStore() {
  let isOnline = typeof window !== "undefined" ? navigator.onLine : true
  const listeners = new Set<() => void>()

  const subscribe = (listener: () => void) => {
    listeners.add(listener)

    const handleOnline = () => {
      isOnline = true
      listeners.forEach((l) => l())
    }

    const handleOffline = () => {
      isOnline = false
      listeners.forEach((l) => l())
    }

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline)
      window.addEventListener("offline", handleOffline)

      return () => {
        listeners.delete(listener)
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
      }
    }

    return () => {
      listeners.delete(listener)
    }
  }

  const getSnapshot = () => isOnline

  return { subscribe, getSnapshot }
}

const onlineStore = createOnlineStore()

function useOnlineStatus() {
  return useSyncExternalStore(
    onlineStore.subscribe,
    onlineStore.getSnapshot,
    () => true, // Server snapshot
  )
}

// Window size store
function createWindowSizeStore() {
  let size =
    typeof window !== "undefined" ? { width: window.innerWidth, height: window.innerHeight } : { width: 0, height: 0 }

  const listeners = new Set<() => void>()

  const subscribe = (listener: () => void) => {
    listeners.add(listener)

    const handleResize = () => {
      size = { width: window.innerWidth, height: window.innerHeight }
      listeners.forEach((l) => l())
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize)
      return () => {
        listeners.delete(listener)
        window.removeEventListener("resize", handleResize)
      }
    }

    return () => {
      listeners.delete(listener)
    }
  }

  const getSnapshot = () => size

  return { subscribe, getSnapshot }
}

const windowSizeStore = createWindowSizeStore()

function useWindowSize() {
  return useSyncExternalStore(
    windowSizeStore.subscribe,
    windowSizeStore.getSnapshot,
    () => ({ width: 0, height: 0 }), // Server snapshot
  )
}

function SyncExternalStoreExample() {
  const isOnline = useOnlineStatus()
  const windowSize = useWindowSize()

  return (
    <div className="p-3 bg-purple-50 rounded">
      <h4 className="font-medium mb-2">useSyncExternalStore Example</h4>

      <div className="space-y-2">
        <div className="p-2 bg-white border rounded">
          <h5 className="text-sm font-medium">Online Status</h5>
          <p className="text-sm">Status: {isOnline ? "🟢 Online" : "🔴 Offline"}</p>
          <p className="text-xs text-gray-600">Try disconnecting your internet to see the change</p>
        </div>

        <div className="p-2 bg-white border rounded">
          <h5 className="text-sm font-medium">Window Size</h5>
          <p className="text-sm">
            Size: {windowSize.width} x {windowSize.height}
          </p>
          <p className="text-xs text-gray-600">Resize your browser window to see updates</p>
        </div>
      </div>

      <p className="text-xs text-gray-600 mt-2">useSyncExternalStore safely subscribes to external data sources</p>
    </div>
  )
}

// Custom store example
interface CounterStore {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

function createCounterStore(): CounterStore & {
  subscribe: (listener: () => void) => () => void
  getSnapshot: () => number
} {
  let count = 0
  const listeners = new Set<() => void>()

  const notifyListeners = () => {
    listeners.forEach((listener) => listener())
  }

  return {
    get count() {
      return count
    },
    increment() {
      count++
      notifyListeners()
    },
    decrement() {
      count--
      notifyListeners()
    },
    reset() {
      count = 0
      notifyListeners()
    },
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    getSnapshot() {
      return count
    },
  }
}

const counterStore = createCounterStore()

function useCounterStore() {
  const count = useSyncExternalStore(
    counterStore.subscribe,
    counterStore.getSnapshot,
    () => 0 // getServerSnapshot - returns initial state for SSR
  )

  return {
    count,
    increment: counterStore.increment,
    decrement: counterStore.decrement,
    reset: counterStore.reset,
  }
}

function CustomStoreExample() {
  const { count, increment, decrement, reset } = useCounterStore()

  return (
    <div className="p-3 bg-pink-50 rounded">
      <h4 className="font-medium mb-2">Custom Store with useSyncExternalStore</h4>

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

      <p className="text-xs text-gray-600 mt-2">Custom external store that can be shared across components</p>
    </div>
  )
}

export default function AdvancedHooksExample() {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">22. Advanced Hooks</h3>
      <div className="space-y-4">
        {/* useLayoutEffect */}
        <LayoutEffectExample />

        {/* useImperativeHandle */}
        <ImperativeHandleExample />

        {/* useId */}
        <UseIdExample />

        {/* useSyncExternalStore */}
        <SyncExternalStoreExample />

        {/* Custom store */}
        <CustomStoreExample />

        {/* Advanced hooks summary */}
        <div className="p-3 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">Advanced Hooks Summary</h4>
          <div className="text-sm space-y-1">
            <p>
              <strong>useLayoutEffect:</strong>
            </p>
            <p>• Runs synchronously after DOM mutations</p>
            <p>• Use for DOM measurements, preventing flicker</p>
            <p>• Blocks browser paint until complete</p>

            <p className="mt-2">
              <strong>useImperativeHandle:</strong>
            </p>
            <p>• Customize ref value exposed to parent</p>
            <p>• Use with forwardRef for imperative APIs</p>
            <p>• Avoid overuse - prefer declarative patterns</p>

            <p className="mt-2">
              <strong>useId:</strong>
            </p>
            <p>• Generate unique IDs for accessibility</p>
            <p>• SSR-safe (consistent client/server IDs)</p>
            <p>• Perfect for form labels and ARIA attributes</p>

            <p className="mt-2">
              <strong>useSyncExternalStore:</strong>
            </p>
            <p>• Subscribe to external data sources safely</p>
            <p>• Handles concurrent rendering correctly</p>
            <p>• Use for browser APIs, third-party stores</p>

            <p className="mt-2">
              <strong>⚠️ When to use:</strong>
            </p>
            <p>• These are specialized hooks for specific use cases</p>
            <p>• Most apps won't need them frequently</p>
            <p>• Prefer standard hooks when possible</p>
          </div>
        </div>
      </div>
    </div>
  )
}
