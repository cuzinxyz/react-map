"use client"

import type React from "react"

import { useReducer, useState } from "react"

// Counter with useReducer
interface CounterState {
  count: number
  step: number
}

type CounterAction =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "RESET" }
  | { type: "SET_STEP"; payload: number }
  | { type: "INCREMENT_BY_STEP" }

const counterReducer = (state: CounterState, action: CounterAction): CounterState => {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 }
    case "DECREMENT":
      return { ...state, count: state.count - 1 }
    case "RESET":
      return { ...state, count: 0 }
    case "SET_STEP":
      return { ...state, step: action.payload }
    case "INCREMENT_BY_STEP":
      return { ...state, count: state.count + state.step }
    default:
      return state
  }
}

// Todo list with useReducer
interface Todo {
  id: number
  text: string
  completed: boolean
}

interface TodoState {
  todos: Todo[]
  filter: "all" | "active" | "completed"
}

type TodoAction =
  | { type: "ADD_TODO"; payload: string }
  | { type: "TOGGLE_TODO"; payload: number }
  | { type: "DELETE_TODO"; payload: number }
  | { type: "SET_FILTER"; payload: "all" | "active" | "completed" }
  | { type: "CLEAR_COMPLETED" }
  | { type: "EDIT_TODO"; payload: { id: number; text: string } }

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload,
            completed: false,
          },
        ],
      }
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) => (todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo)),
      }
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      }
    case "SET_FILTER":
      return {
        ...state,
        filter: action.payload,
      }
    case "CLEAR_COMPLETED":
      return {
        ...state,
        todos: state.todos.filter((todo) => !todo.completed),
      }
    case "EDIT_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id ? { ...todo, text: action.payload.text } : todo,
        ),
      }
    default:
      return state
  }
}

// Form with useReducer
interface FormState {
  name: string
  email: string
  message: string
  errors: {
    name?: string
    email?: string
    message?: string
  }
  isSubmitting: boolean
  isSubmitted: boolean
}

type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: any }
  | { type: "SET_ERROR"; field: keyof FormState["errors"]; error: string }
  | { type: "CLEAR_ERROR"; field: keyof FormState["errors"] }
  | { type: "SET_SUBMITTING"; value: boolean }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "RESET_FORM" }

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value }
    case "SET_ERROR":
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
      }
    case "CLEAR_ERROR":
      return {
        ...state,
        errors: { ...state.errors, [action.field]: undefined },
      }
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.value }
    case "SUBMIT_SUCCESS":
      return { ...state, isSubmitting: false, isSubmitted: true }
    case "RESET_FORM":
      return {
        name: "",
        email: "",
        message: "",
        errors: {},
        isSubmitting: false,
        isSubmitted: false,
      }
    default:
      return state
  }
}

export default function UseReducerExample() {
  // Counter with useReducer
  const [counterState, counterDispatch] = useReducer(counterReducer, {
    count: 0,
    step: 1,
  })

  // Todo list with useReducer
  const [todoState, todoDispatch] = useReducer(todoReducer, {
    todos: [
      { id: 1, text: "Learn useReducer", completed: false },
      { id: 2, text: "Build todo app", completed: true },
    ],
    filter: "all",
  })

  // Form with useReducer
  const [formState, formDispatch] = useReducer(formReducer, {
    name: "",
    email: "",
    message: "",
    errors: {},
    isSubmitting: false,
    isSubmitted: false,
  })

  const [newTodo, setNewTodo] = useState("")
  const [editingTodo, setEditingTodo] = useState<number | null>(null)
  const [editText, setEditText] = useState("")

  // Todo functions
  const addTodo = () => {
    if (newTodo.trim()) {
      todoDispatch({ type: "ADD_TODO", payload: newTodo.trim() })
      setNewTodo("")
    }
  }

  const startEdit = (todo: Todo) => {
    setEditingTodo(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = () => {
    if (editingTodo && editText.trim()) {
      todoDispatch({
        type: "EDIT_TODO",
        payload: { id: editingTodo, text: editText.trim() },
      })
      setEditingTodo(null)
      setEditText("")
    }
  }

  const cancelEdit = () => {
    setEditingTodo(null)
    setEditText("")
  }

  // Form functions
  const validateForm = () => {
    let isValid = true

    if (!formState.name.trim()) {
      formDispatch({ type: "SET_ERROR", field: "name", error: "Name is required" })
      isValid = false
    }

    if (!formState.email.trim()) {
      formDispatch({ type: "SET_ERROR", field: "email", error: "Email is required" })
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      formDispatch({ type: "SET_ERROR", field: "email", error: "Email is invalid" })
      isValid = false
    }

    if (!formState.message.trim()) {
      formDispatch({ type: "SET_ERROR", field: "message", error: "Message is required" })
      isValid = false
    }

    return isValid
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      formDispatch({ type: "SET_SUBMITTING", value: true })

      // Simulate API call
      setTimeout(() => {
        formDispatch({ type: "SUBMIT_SUCCESS" })
      }, 2000)
    }
  }

  // Filter todos
  const filteredTodos = todoState.todos.filter((todo) => {
    switch (todoState.filter) {
      case "active":
        return !todo.completed
      case "completed":
        return todo.completed
      default:
        return true
    }
  })

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">11. useReducer Example</h3>
      <div className="space-y-6">
        {/* Counter with useReducer */}
        <div className="p-3 bg-blue-50 rounded">
          <h4 className="font-medium mb-2">Counter with useReducer</h4>
          <div className="space-y-2">
            <p className="text-sm">Count: {counterState.count}</p>
            <p className="text-sm">Step: {counterState.step}</p>

            <div className="space-x-2">
              <button
                onClick={() => counterDispatch({ type: "INCREMENT" })}
                className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
              >
                +1
              </button>
              <button
                onClick={() => counterDispatch({ type: "DECREMENT" })}
                className="px-2 py-1 bg-red-500 text-white rounded text-sm"
              >
                -1
              </button>
              <button
                onClick={() => counterDispatch({ type: "INCREMENT_BY_STEP" })}
                className="px-2 py-1 bg-green-500 text-white rounded text-sm"
              >
                +{counterState.step}
              </button>
              <button
                onClick={() => counterDispatch({ type: "RESET" })}
                className="px-2 py-1 bg-gray-500 text-white rounded text-sm"
              >
                Reset
              </button>
            </div>

            <div>
              <label className="text-sm mr-2">Step:</label>
              <input
                type="number"
                value={counterState.step}
                onChange={(e) =>
                  counterDispatch({
                    type: "SET_STEP",
                    payload: Number.parseInt(e.target.value) || 1,
                  })
                }
                className="px-2 py-1 border rounded text-sm w-16"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Todo list with useReducer */}
        <div className="p-3 bg-green-50 rounded">
          <h4 className="font-medium mb-2">Todo List with useReducer</h4>

          {/* Add todo */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              placeholder="Add new todo..."
              className="flex-1 px-2 py-1 border rounded text-sm"
            />
            <button onClick={addTodo} className="px-3 py-1 bg-green-500 text-white rounded text-sm">
              Add
            </button>
          </div>

          {/* Filter buttons */}
          <div className="flex gap-2 mb-3">
            {(["all", "active", "completed"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => todoDispatch({ type: "SET_FILTER", payload: filter })}
                className={`px-2 py-1 rounded text-sm capitalize ${
                  todoState.filter === filter ? "bg-green-600 text-white" : "bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
            <button
              onClick={() => todoDispatch({ type: "CLEAR_COMPLETED" })}
              className="px-2 py-1 bg-red-500 text-white rounded text-sm"
            >
              Clear Completed
            </button>
          </div>

          {/* Todo list */}
          <div className="space-y-2">
            {filteredTodos.map((todo) => (
              <div key={todo.id} className="flex items-center gap-2 p-2 bg-white rounded border">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => todoDispatch({ type: "TOGGLE_TODO", payload: todo.id })}
                />

                {editingTodo === todo.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 px-2 py-1 border rounded text-sm"
                    />
                    <button onClick={saveEdit} className="px-2 py-1 bg-green-500 text-white rounded text-xs">
                      Save
                    </button>
                    <button onClick={cancelEdit} className="px-2 py-1 bg-gray-500 text-white rounded text-xs">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span className={`flex-1 text-sm ${todo.completed ? "line-through text-gray-500" : ""}`}>
                      {todo.text}
                    </span>
                    <button
                      onClick={() => startEdit(todo)}
                      className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => todoDispatch({ type: "DELETE_TODO", payload: todo.id })}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>

          <p className="text-sm mt-2 text-gray-600">
            Total: {todoState.todos.length} | Active: {todoState.todos.filter((t) => !t.completed).length} | Completed:{" "}
            {todoState.todos.filter((t) => t.completed).length}
          </p>
        </div>

        {/* Form with useReducer */}
        <div className="p-3 bg-yellow-50 rounded">
          <h4 className="font-medium mb-2">Form with useReducer</h4>

          {formState.isSubmitted ? (
            <div className="text-center">
              <p className="text-green-600 mb-2">Form submitted successfully!</p>
              <button
                onClick={() => formDispatch({ type: "RESET_FORM" })}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                Submit Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => {
                    formDispatch({ type: "SET_FIELD", field: "name", value: e.target.value })
                    if (formState.errors.name) {
                      formDispatch({ type: "CLEAR_ERROR", field: "name" })
                    }
                  }}
                  placeholder="Name"
                  className={`w-full px-2 py-1 border rounded text-sm ${
                    formState.errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formState.errors.name && <p className="text-red-500 text-xs mt-1">{formState.errors.name}</p>}
              </div>

              <div>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(e) => {
                    formDispatch({ type: "SET_FIELD", field: "email", value: e.target.value })
                    if (formState.errors.email) {
                      formDispatch({ type: "CLEAR_ERROR", field: "email" })
                    }
                  }}
                  placeholder="Email"
                  className={`w-full px-2 py-1 border rounded text-sm ${
                    formState.errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formState.errors.email && <p className="text-red-500 text-xs mt-1">{formState.errors.email}</p>}
              </div>

              <div>
                <textarea
                  value={formState.message}
                  onChange={(e) => {
                    formDispatch({ type: "SET_FIELD", field: "message", value: e.target.value })
                    if (formState.errors.message) {
                      formDispatch({ type: "CLEAR_ERROR", field: "message" })
                    }
                  }}
                  placeholder="Message"
                  rows={3}
                  className={`w-full px-2 py-1 border rounded text-sm ${
                    formState.errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formState.errors.message && <p className="text-red-500 text-xs mt-1">{formState.errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={formState.isSubmitting}
                className="w-full px-3 py-2 bg-yellow-500 text-white rounded text-sm disabled:opacity-50"
              >
                {formState.isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          )}
        </div>

        {/* useReducer vs useState comparison */}
        <div className="p-3 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">useReducer vs useState</h4>
          <div className="text-sm space-y-1">
            <p>
              <strong>Use useReducer when:</strong>
            </p>
            <p>✅ Complex state logic</p>
            <p>✅ Multiple sub-values</p>
            <p>✅ Next state depends on previous</p>
            <p>✅ State transitions are predictable</p>
            <p>
              <strong>Use useState when:</strong>
            </p>
            <p>✅ Simple state values</p>
            <p>✅ Independent state updates</p>
          </div>
        </div>
      </div>
    </div>
  )
}
