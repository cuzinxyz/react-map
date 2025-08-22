"use client"

import { useState } from "react"

interface Todo {
  id: number
  text: string
  completed: boolean
}

interface User {
  id: number
  name: string
  email: string
  age: number
}

export default function ListsAndKeys() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Learn React", completed: true },
    { id: 2, text: "Build an app", completed: false },
    { id: 3, text: "Deploy to production", completed: false },
  ])

  const [newTodo, setNewTodo] = useState("")

  const users: User[] = [
    { id: 1, name: "John Doe", email: "john@example.com", age: 25 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", age: 30 },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", age: 35 },
  ]

  const fruits = ["Apple", "Banana", "Orange", "Grape", "Mango"]

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo,
          completed: false,
        },
      ])
      setNewTodo("")
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">7. Lists and Keys</h3>
      <div className="space-y-4">
        {/* Simple array rendering */}
        <div className="p-3 bg-blue-50 rounded">
          <h4 className="font-medium mb-2">Simple Array (Fruits)</h4>
          <div className="flex flex-wrap gap-2">
            {fruits.map((fruit, index) => (
              <span
                key={index} // Using index as key (not recommended for dynamic lists)
                className="px-2 py-1 bg-blue-200 rounded text-sm"
              >
                {fruit}
              </span>
            ))}
          </div>
        </div>

        {/* Object array rendering */}
        <div className="p-3 bg-green-50 rounded">
          <h4 className="font-medium mb-2">Object Array (Users)</h4>
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id} // Using unique ID as key (recommended)
                className="p-2 bg-white rounded border text-sm"
              >
                <div className="font-medium">{user.name}</div>
                <div className="text-gray-600">
                  {user.email} • Age: {user.age}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic list with CRUD operations */}
        <div className="p-3 bg-yellow-50 rounded">
          <h4 className="font-medium mb-2">Dynamic List (Todo App)</h4>

          {/* Add new todo */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              placeholder="Add new todo..."
              className="flex-1 px-2 py-1 border rounded text-sm"
            />
            <button onClick={addTodo} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">
              Add
            </button>
          </div>

          {/* Todo list */}
          <div className="space-y-2">
            {todos.map((todo) => (
              <div
                key={todo.id} // Using unique ID as key
                className={`p-2 bg-white rounded border text-sm flex items-center justify-between ${
                  todo.completed ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="rounded"
                  />
                  <span className={todo.completed ? "line-through" : ""}>{todo.text}</span>
                </div>
                <button onClick={() => deleteTodo(todo.id)} className="px-2 py-1 bg-red-500 text-white rounded text-xs">
                  Delete
                </button>
              </div>
            ))}
          </div>

          {todos.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No todos yet. Add one above!</p>}
        </div>

        {/* Filtered lists */}
        <div className="p-3 bg-purple-50 rounded">
          <h4 className="font-medium mb-2">Filtered Lists</h4>
          <div className="space-y-2">
            <div>
              <h5 className="text-sm font-medium">Completed Todos:</h5>
              <div className="text-sm">
                {todos
                  .filter((todo) => todo.completed)
                  .map((todo) => (
                    <div key={`completed-${todo.id}`} className="text-green-600">
                      ✓ {todo.text}
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium">Pending Todos:</h5>
              <div className="text-sm">
                {todos
                  .filter((todo) => !todo.completed)
                  .map((todo) => (
                    <div key={`pending-${todo.id}`} className="text-orange-600">
                      ○ {todo.text}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Key importance demonstration */}
        <div className="p-3 bg-red-50 rounded">
          <h4 className="font-medium mb-2">Key Importance</h4>
          <p className="text-sm text-gray-700 mb-2">
            Keys help React identify which items have changed, are added, or removed. Always use unique, stable keys for
            list items.
          </p>
          <div className="text-xs space-y-1">
            <div>
              ✅ Good: <code>key={`{user.id}`}</code> (unique, stable)
            </div>
            <div>
              ⚠️ Okay: <code>key={`{index}`}</code> (only for static lists)
            </div>
            <div>
              ❌ Bad: <code>key={`{Math.random()}`}</code> (not stable)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
