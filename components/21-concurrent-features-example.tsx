"use client"

import type React from "react"

import { useState, useTransition, useDeferredValue, startTransition, useMemo } from "react"

// Heavy computation component
function HeavyList({ items, filter }: { items: string[]; filter: string }) {
  const filteredItems = useMemo(() => {
    console.log("🔄 Filtering items...")
    // Simulate heavy computation
    const start = performance.now()
    const filtered = items.filter((item) => {
      if (!item || typeof item !== "string") return false
      const safeFilter = filter || ""
      return item.toLowerCase().includes(safeFilter.toLowerCase())
    })
    const end = performance.now()
    console.log(`Filtering took ${end - start}ms`)
    return filtered
  }, [items, filter])

  return (
    <div className="space-y-1">
      <p className="text-sm text-gray-600">
        Showing {filteredItems.length} of {items.length} items
      </p>
      <div className="max-h-40 overflow-y-auto space-y-1">
        {filteredItems.map((item, index) => (
          <div key={index} className="p-2 bg-white border rounded text-sm">
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

// Component demonstrating useTransition
function TransitionExample() {
  const [isPending, startTransition] = useTransition()
  const [input, setInput] = useState("")
  const [list, setList] = useState<string[]>([])

  // Generate large list of items
  const generateItems = (count: number) => {
    return Array.from({ length: count }, (_, i) => `Item ${i + 1} - ${Math.random().toString(36).substring(7)}`)
  }

  const handleGenerateSmall = () => {
    startTransition(() => {
      setList(generateItems(100))
    })
  }

  const handleGenerateLarge = () => {
    startTransition(() => {
      setList(generateItems(5000))
    })
  }

  const handleClear = () => {
    startTransition(() => {
      setList([])
    })
  }

  return (
    <div className="p-3 bg-blue-50 rounded">
      <h4 className="font-medium mb-2">useTransition Example</h4>

      <div className="space-y-2 mb-3">
        <div className="space-x-2">
          <button
            onClick={handleGenerateSmall}
            disabled={isPending}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm disabled:opacity-50"
          >
            Generate 100 Items
          </button>
          <button
            onClick={handleGenerateLarge}
            disabled={isPending}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm disabled:opacity-50"
          >
            Generate 5000 Items
          </button>
          <button
            onClick={handleClear}
            disabled={isPending}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm disabled:opacity-50"
          >
            Clear
          </button>
        </div>

        {isPending && <div className="text-sm text-blue-600">⏳ Updating list... (non-blocking)</div>}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Filter items (stays responsive)"
        className="w-full px-2 py-1 border rounded text-sm mb-2"
      />

      <HeavyList items={list} filter={input} />

      <p className="text-xs text-gray-600 mt-2">Notice how the input stays responsive even during heavy list updates</p>
    </div>
  )
}

// Component demonstrating useDeferredValue
function DeferredValueExample() {
  const [input, setInput] = useState("")
  const deferredInput = useDeferredValue(input)
  const [items] = useState(() =>
    Array.from(
      { length: 2000 },
      (_, i) => `Product ${i + 1} - ${["Apple", "Banana", "Cherry", "Date", "Elderberry"][i % 5]}`,
    ),
  )

  const isStale = input !== deferredInput

  return (
    <div className="p-3 bg-green-50 rounded">
      <h4 className="font-medium mb-2">useDeferredValue Example</h4>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search products..."
        className="w-full px-2 py-1 border rounded text-sm mb-2"
      />

      <div className="text-sm mb-2">
        <span>Current input: "{input}"</span>
        <br />
        <span>Deferred input: "{deferredInput}"</span>
        {isStale && <span className="text-orange-600 ml-2">⏳ Updating...</span>}
      </div>

      <div className={`transition-opacity ${isStale ? "opacity-50" : "opacity-100"}`}>
        <HeavyList items={items} filter={deferredInput} />
      </div>

      <p className="text-xs text-gray-600 mt-2">
        The search is deferred to keep typing responsive. Notice the opacity change during updates.
      </p>
    </div>
  )
}

// Component demonstrating startTransition
function StartTransitionExample() {
  const [count, setCount] = useState(0)
  const [items, setItems] = useState<number[]>([])

  const handleUrgentUpdate = () => {
    // Urgent update - happens immediately
    setCount((c) => c + 1)
  }

  const handleNonUrgentUpdate = () => {
    // Non-urgent update - can be interrupted
    startTransition(() => {
      setItems(Array.from({ length: 1000 }, (_, i) => i))
    })
  }

  const handleBothUpdates = () => {
    // Urgent update first
    setCount((c) => c + 1)

    // Then non-urgent update
    startTransition(() => {
      setItems(Array.from({ length: 2000 }, (_, i) => i))
    })
  }

  return (
    <div className="p-3 bg-yellow-50 rounded">
      <h4 className="font-medium mb-2">startTransition Example</h4>

      <div className="space-y-2 mb-3">
        <div className="text-sm">
          <strong>Urgent Counter:</strong> {count}
        </div>

        <div className="space-x-2">
          <button onClick={handleUrgentUpdate} className="px-3 py-1 bg-green-500 text-white rounded text-sm">
            Urgent Update (Counter)
          </button>
          <button onClick={handleNonUrgentUpdate} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">
            Non-Urgent Update (List)
          </button>
          <button onClick={handleBothUpdates} className="px-3 py-1 bg-orange-500 text-white rounded text-sm">
            Both Updates
          </button>
        </div>
      </div>

      <div className="text-sm mb-2">
        <strong>List Items:</strong> {items.length}
      </div>

      {items.length > 0 && (
        <div className="max-h-32 overflow-y-auto bg-white border rounded p-2">
          <div className="grid grid-cols-10 gap-1 text-xs">
            {items.slice(0, 100).map((item) => (
              <div key={item} className="p-1 bg-gray-100 rounded text-center">
                {item}
              </div>
            ))}
          </div>
          {items.length > 100 && (
            <div className="text-center text-xs text-gray-500 mt-2">... and {items.length - 100} more items</div>
          )}
        </div>
      )}

      <p className="text-xs text-gray-600 mt-2">
        Counter updates are urgent and happen immediately. List updates are non-urgent and can be interrupted.
      </p>
    </div>
  )
}

// Performance comparison component
function PerformanceComparison() {
  const [withConcurrent, setWithConcurrent] = useState(true)
  const [input, setInput] = useState("")
  const [list, setList] = useState<string[]>([])

  const items = useMemo(
    () =>
      Array.from(
        { length: 3000 },
        (_, i) => `Item ${i + 1} - ${["React", "Vue", "Angular", "Svelte", "Solid"][i % 5]}`,
      ),
    [],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)

    if (withConcurrent) {
      // Use concurrent features
      startTransition(() => {
        setList(
          items.filter((item) => {
            if (!item || typeof item !== "string") return false
            const safeValue = value || ""
            return item.toLowerCase().includes(safeValue.toLowerCase())
          }),
        )
      })
    } else {
      // Direct update (blocking)
      setList(
        items.filter((item) => {
          if (!item || typeof item !== "string") return false
          const safeValue = value || ""
          return item.toLowerCase().includes(safeValue.toLowerCase())
        }),
      )
    }
  }

  return (
    <div className="p-3 bg-purple-50 rounded">
      <h4 className="font-medium mb-2">Performance Comparison</h4>

      <div className="mb-3">
        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            checked={withConcurrent}
            onChange={(e) => setWithConcurrent(e.target.checked)}
            className="mr-2"
          />
          Use Concurrent Features
        </label>
      </div>

      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Type to filter 3000 items..."
        className="w-full px-2 py-1 border rounded text-sm mb-2"
      />

      <div className="text-sm mb-2">Mode: {withConcurrent ? "⚡ Concurrent (Non-blocking)" : "🐌 Blocking"}</div>

      <div className="max-h-40 overflow-y-auto space-y-1">
        {list.slice(0, 50).map((item, index) => (
          <div key={index} className="p-1 bg-white border rounded text-xs">
            {item}
          </div>
        ))}
        {list.length > 50 && (
          <div className="text-center text-xs text-gray-500 p-2">... and {list.length - 50} more items</div>
        )}
      </div>

      <p className="text-xs text-gray-600 mt-2">
        Try typing with concurrent features on/off. Notice the difference in input responsiveness.
      </p>
    </div>
  )
}

export default function ConcurrentFeaturesExample() {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">21. Concurrent Features (React 18+)</h3>
      <div className="space-y-4">
        {/* useTransition */}
        <TransitionExample />

        {/* useDeferredValue */}
        <DeferredValueExample />

        {/* startTransition */}
        <StartTransitionExample />

        {/* Performance comparison */}
        <PerformanceComparison />

        {/* Concurrent features explanation */}
        <div className="p-3 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">Concurrent Features Overview</h4>
          <div className="text-sm space-y-1">
            <p>
              <strong>useTransition:</strong>
            </p>
            <p>• Mark state updates as non-urgent</p>
            <p>• Returns isPending flag for loading states</p>
            <p>• Keeps UI responsive during heavy updates</p>

            <p className="mt-2">
              <strong>useDeferredValue:</strong>
            </p>
            <p>• Defer expensive computations</p>
            <p>• Show stale content while computing new values</p>
            <p>• Automatically batches updates</p>

            <p className="mt-2">
              <strong>startTransition:</strong>
            </p>
            <p>• Imperative API for marking updates as non-urgent</p>
            <p>• Use when you can't use useTransition hook</p>
            <p>• Good for event handlers and effects</p>

            <p className="mt-2">
              <strong>🎯 Benefits:</strong>
            </p>
            <p>• Better user experience</p>
            <p>• Responsive interactions</p>
            <p>• Automatic prioritization</p>
            <p>• Interruptible rendering</p>

            <p className="mt-2">
              <strong>⚠️ When to use:</strong>
            </p>
            <p>• Heavy list filtering/sorting</p>
            <p>• Complex form validation</p>
            <p>• Data visualization updates</p>
            <p>• Any expensive state updates</p>
          </div>
        </div>
      </div>
    </div>
  )
}
