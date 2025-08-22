"use client"

import { useState } from "react"

export default function StateExample() {
  // Basic state
  const [count, setCount] = useState(0)
  const [name, setName] = useState("")
  const [isVisible, setIsVisible] = useState(true)

  // Object state
  const [user, setUser] = useState({
    name: "John",
    age: 25,
    email: "john@example.com",
  })

  // Array state
  const [items, setItems] = useState(["Item 1", "Item 2"])

  const addItem = () => {
    setItems([...items, `Item ${items.length + 1}`])
  }

  const updateUser = () => {
    setUser((prev) => ({
      ...prev,
      age: prev.age + 1,
    }))
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">4. State Example (useState)</h3>
      <div className="space-y-4">
        {/* Counter */}
        <div className="p-3 bg-blue-50 rounded">
          <h4 className="font-medium mb-2">Counter: {count}</h4>
          <div className="space-x-2">
            <button onClick={() => setCount(count + 1)} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
              +
            </button>
            <button onClick={() => setCount(count - 1)} className="px-3 py-1 bg-red-500 text-white rounded text-sm">
              -
            </button>
            <button onClick={() => setCount(0)} className="px-3 py-1 bg-gray-500 text-white rounded text-sm">
              Reset
            </button>
          </div>
        </div>

        {/* Input state */}
        <div className="p-3 bg-green-50 rounded">
          <h4 className="font-medium mb-2">Input State</h4>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="px-2 py-1 border rounded text-sm w-full mb-2"
          />
          <p className="text-sm">Hello, {name || "Anonymous"}!</p>
        </div>

        {/* Boolean state */}
        <div className="p-3 bg-yellow-50 rounded">
          <h4 className="font-medium mb-2">Toggle Visibility</h4>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="px-3 py-1 bg-yellow-500 text-white rounded text-sm mb-2"
          >
            {isVisible ? "Hide" : "Show"}
          </button>
          {isVisible && <p className="text-sm">This content is visible!</p>}
        </div>

        {/* Object state */}
        <div className="p-3 bg-purple-50 rounded">
          <h4 className="font-medium mb-2">Object State</h4>
          <p className="text-sm">
            Name: {user.name}, Age: {user.age}
          </p>
          <button onClick={updateUser} className="px-3 py-1 bg-purple-500 text-white rounded text-sm mt-2">
            Increase Age
          </button>
        </div>

        {/* Array state */}
        <div className="p-3 bg-pink-50 rounded">
          <h4 className="font-medium mb-2">Array State</h4>
          <ul className="text-sm mb-2">
            {items.map((item, index) => (
              <li key={index} className="list-disc list-inside">
                {item}
              </li>
            ))}
          </ul>
          <button onClick={addItem} className="px-3 py-1 bg-pink-500 text-white rounded text-sm">
            Add Item
          </button>
        </div>
      </div>
    </div>
  )
}
