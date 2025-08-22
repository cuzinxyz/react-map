"use client"

import { useState, useMemo, useCallback, memo } from "react"

// Expensive calculation function
const expensiveCalculation = (num: number): number => {
  console.log("🔄 Running expensive calculation...")
  let result = 0
  for (let i = 0; i < 1000000; i++) {
    result += num * i
  }
  return result
}

// Child component without memo
function RegularChild({ name, onClick }: { name: string; onClick: () => void }) {
  console.log("🔄 RegularChild rendered")
  return (
    <div className="p-2 bg-red-100 rounded border">
      <p className="text-sm">Regular Child: {name}</p>
      <button onClick={onClick} className="px-2 py-1 bg-red-500 text-white rounded text-xs mt-1">
        Click me
      </button>
    </div>
  )
}

// Child component with memo
const MemoizedChild = memo(function MemoizedChild({
  name,
  onClick,
}: {
  name: string
  onClick: () => void
}) {
  console.log("🔄 MemoizedChild rendered")
  return (
    <div className="p-2 bg-green-100 rounded border">
      <p className="text-sm">Memoized Child: {name}</p>
      <button onClick={onClick} className="px-2 py-1 bg-green-500 text-white rounded text-xs mt-1">
        Click me
      </button>
    </div>
  )
})

// Child component with memo and custom comparison
const MemoizedChildWithComparison = memo(
  function MemoizedChildWithComparison({
    user,
    onClick,
  }: {
    user: { name: string; age: number; email: string }
    onClick: () => void
  }) {
    console.log("🔄 MemoizedChildWithComparison rendered")
    return (
      <div className="p-2 bg-blue-100 rounded border">
        <p className="text-sm">
          User: {user.name} ({user.age})
        </p>
        <button onClick={onClick} className="px-2 py-1 bg-blue-500 text-white rounded text-xs mt-1">
          Click me
        </button>
      </div>
    )
  },
  // Custom comparison function - only re-render if name or age changes
  (prevProps, nextProps) => {
    return prevProps.user.name === nextProps.user.name && prevProps.user.age === nextProps.user.age
  },
)

// List component to demonstrate useMemo with filtering
function TodoList({
  todos,
  filter,
}: {
  todos: Array<{ id: number; text: string; completed: boolean }>
  filter: "all" | "active" | "completed"
}) {
  console.log("🔄 TodoList rendered")

  // Without useMemo - this would run on every render
  const filteredTodos = useMemo(() => {
    console.log("🔄 Filtering todos...")
    return todos.filter((todo) => {
      switch (filter) {
        case "active":
          return !todo.completed
        case "completed":
          return todo.completed
        default:
          return true
      }
    })
  }, [todos, filter])

  // Expensive calculation with useMemo
  const todoStats = useMemo(() => {
    console.log("🔄 Calculating todo stats...")
    return {
      total: todos.length,
      completed: todos.filter((t) => t.completed).length,
      active: todos.filter((t) => !t.completed).length,
    }
  }, [todos])

  return (
    <div className="space-y-2">
      <div className="text-sm bg-gray-100 p-2 rounded">
        <p>
          Stats: {todoStats.total} total, {todoStats.active} active, {todoStats.completed} completed
        </p>
      </div>
      <div className="space-y-1">
        {filteredTodos.map((todo) => (
          <div key={todo.id} className="text-sm p-2 bg-white border rounded">
            <span className={todo.completed ? "line-through" : ""}>{todo.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MemoizationExample() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState("John")
  const [inputValue, setInputValue] = useState("")
  const [user, setUser] = useState({ name: "Alice", age: 25, email: "alice@example.com" })
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React", completed: true },
    { id: 2, text: "Learn useMemo", completed: false },
    { id: 3, text: "Learn useCallback", completed: false },
    { id: 4, text: "Build an app", completed: false },
  ])
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

  // useMemo for expensive calculation
  const expensiveValue = useMemo(() => {
    return expensiveCalculation(count)
  }, [count])

  // useMemo for derived state
  const uppercaseName = useMemo(() => {
    console.log("🔄 Converting name to uppercase...")
    return name.toUpperCase()
  }, [name])

  // useCallback for event handlers
  const handleRegularClick = useCallback(() => {
    console.log("Regular button clicked")
  }, [])

  const handleMemoizedClick = useCallback(() => {
    console.log("Memoized button clicked")
  }, [])

  const handleUserClick = useCallback(() => {
    console.log("User button clicked")
  }, [])

  // useCallback with dependencies
  const handleTodoToggle = useCallback((id: number) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }, [])

  // Function that changes on every render (for comparison)
  const handleRegularClickNoCallback = () => {
    console.log("Regular button clicked (no callback)")
  }

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: inputValue,
          completed: false,
        },
      ])
      setInputValue("")
    }
  }

  const updateUserEmail = () => {
    setUser((prev) => ({ ...prev, email: `updated-${Date.now()}@example.com` }))
  }

  const updateUserAge = () => {
    setUser((prev) => ({ ...prev, age: prev.age + 1 }))
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">16. Memoization (useMemo, useCallback, React.memo)</h3>
      <div className="space-y-4">
        {/* Controls */}
        <div className="p-3 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">Controls (Check console for render logs)</h4>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setCount(count + 1)} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
              Count: {count}
            </button>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Change name"
              className="px-2 py-1 border rounded text-sm"
            />
            <button onClick={updateUserEmail} className="px-3 py-1 bg-purple-500 text-white rounded text-sm">
              Update User Email
            </button>
            <button onClick={updateUserAge} className="px-3 py-1 bg-orange-500 text-white rounded text-sm">
              Update User Age
            </button>
          </div>
        </div>

        {/* useMemo example */}
        <div className="p-3 bg-blue-50 rounded">
          <h4 className="font-medium mb-2">useMemo Example</h4>
          <div className="space-y-2">
            <p className="text-sm">Expensive calculation result: {expensiveValue}</p>
            <p className="text-sm">Uppercase name: {uppercaseName}</p>
            <p className="text-xs text-gray-600">
              Expensive calculation only runs when count changes, not when name changes
            </p>
          </div>
        </div>

        {/* React.memo comparison */}
        <div className="p-3 bg-green-50 rounded">
          <h4 className="font-medium mb-2">React.memo Comparison</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium mb-2">Without memo (always re-renders)</h5>
              <RegularChild name={name} onClick={handleRegularClickNoCallback} />
            </div>
            <div>
              <h5 className="text-sm font-medium mb-2">With memo + useCallback</h5>
              <MemoizedChild name={name} onClick={handleMemoizedClick} />
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Regular child re-renders on every parent update. Memoized child only re-renders when name changes.
          </p>
        </div>

        {/* React.memo with custom comparison */}
        <div className="p-3 bg-yellow-50 rounded">
          <h4 className="font-medium mb-2">React.memo with Custom Comparison</h4>
          <MemoizedChildWithComparison user={user} onClick={handleUserClick} />
          <p className="text-xs text-gray-600 mt-2">
            This component only re-renders when user name or age changes, not email.
          </p>
        </div>

        {/* Todo list with useMemo */}
        <div className="p-3 bg-purple-50 rounded">
          <h4 className="font-medium mb-2">Todo List with useMemo</h4>

          {/* Add todo */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add new todo..."
              className="flex-1 px-2 py-1 border rounded text-sm"
            />
            <button onClick={addTodo} className="px-3 py-1 bg-purple-500 text-white rounded text-sm">
              Add
            </button>
          </div>

          {/* Filter buttons */}
          <div className="flex gap-2 mb-3">
            {(["all", "active", "completed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-1 rounded text-sm capitalize ${
                  filter === f ? "bg-purple-600 text-white" : "bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Todo list */}
          <TodoList todos={todos} filter={filter} />
        </div>

        {/* useCallback example */}
        <div className="p-3 bg-pink-50 rounded">
          <h4 className="font-medium mb-2">useCallback Example</h4>
          <div className="space-y-2">
            {todos.map((todo) => (
              <div key={todo.id} className="flex items-center gap-2 p-2 bg-white rounded border">
                <input type="checkbox" checked={todo.completed} onChange={() => handleTodoToggle(todo.id)} />
                <span className={`text-sm ${todo.completed ? "line-through" : ""}`}>{todo.text}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-2">
            handleTodoToggle is memoized with useCallback to prevent unnecessary re-renders
          </p>
        </div>

        {/* Performance tips */}
        <div className="p-3 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">Memoization Best Practices</h4>
          <div className="text-sm space-y-1">
            <p>
              <strong>useMemo:</strong>
            </p>
            <p>✅ Expensive calculations</p>
            <p>✅ Complex object/array creation</p>
            <p>❌ Simple calculations (overhead not worth it)</p>

            <p className="mt-2">
              <strong>useCallback:</strong>
            </p>
            <p>✅ Functions passed to memoized components</p>
            <p>✅ Functions in dependency arrays</p>
            <p>❌ Every function (creates unnecessary complexity)</p>

            <p className="mt-2">
              <strong>React.memo:</strong>
            </p>
            <p>✅ Components that re-render frequently with same props</p>
            <p>✅ Expensive components</p>
            <p>❌ Components that change props frequently</p>
          </div>
        </div>
      </div>
    </div>
  )
}
