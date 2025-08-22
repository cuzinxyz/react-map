"use client"

import { useState } from "react"

export default function ConditionalRendering() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<"admin" | "user" | "guest">("guest")
  const [showDetails, setShowDetails] = useState(false)
  const [items, setItems] = useState<string[]>([])

  const addItem = () => {
    setItems([...items, `Item ${items.length + 1}`])
  }

  const clearItems = () => {
    setItems([])
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">6. Conditional Rendering</h3>
      <div className="space-y-4">
        {/* If-else with ternary operator */}
        <div className="p-3 bg-blue-50 rounded">
          <h4 className="font-medium mb-2">Ternary Operator</h4>
          <p className="text-sm mb-2">Status: {isLoggedIn ? "Logged In" : "Logged Out"}</p>
          <button
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className={`px-3 py-1 text-white rounded text-sm ${isLoggedIn ? "bg-red-500" : "bg-green-500"}`}
          >
            {isLoggedIn ? "Logout" : "Login"}
          </button>
        </div>

        {/* Logical AND operator */}
        <div className="p-3 bg-green-50 rounded">
          <h4 className="font-medium mb-2">Logical AND (&&)</h4>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm mb-2"
          >
            {showDetails ? "Hide" : "Show"} Details
          </button>
          {showDetails && (
            <div className="p-2 bg-white rounded border text-sm">
              <p>These are the details that are conditionally shown.</p>
              <p>Only visible when showDetails is true.</p>
            </div>
          )}
        </div>

        {/* Multiple conditions */}
        <div className="p-3 bg-yellow-50 rounded">
          <h4 className="font-medium mb-2">Multiple Conditions</h4>
          <div className="space-x-2 mb-2">
            <button
              onClick={() => setUserRole("admin")}
              className={`px-3 py-1 rounded text-sm ${userRole === "admin" ? "bg-red-500 text-white" : "bg-gray-200"}`}
            >
              Admin
            </button>
            <button
              onClick={() => setUserRole("user")}
              className={`px-3 py-1 rounded text-sm ${userRole === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              User
            </button>
            <button
              onClick={() => setUserRole("guest")}
              className={`px-3 py-1 rounded text-sm ${userRole === "guest" ? "bg-gray-500 text-white" : "bg-gray-200"}`}
            >
              Guest
            </button>
          </div>

          {/* Switch-like conditional rendering */}
          <div className="text-sm">
            {userRole === "admin" && (
              <div className="p-2 bg-red-100 rounded">Admin Panel: You have full access to all features.</div>
            )}
            {userRole === "user" && (
              <div className="p-2 bg-blue-100 rounded">User Dashboard: You have access to basic features.</div>
            )}
            {userRole === "guest" && (
              <div className="p-2 bg-gray-100 rounded">Guest View: Limited access. Please login for more features.</div>
            )}
          </div>
        </div>

        {/* Conditional rendering with arrays */}
        <div className="p-3 bg-purple-50 rounded">
          <h4 className="font-medium mb-2">Conditional with Arrays</h4>
          <div className="space-x-2 mb-2">
            <button onClick={addItem} className="px-3 py-1 bg-purple-500 text-white rounded text-sm">
              Add Item
            </button>
            <button onClick={clearItems} className="px-3 py-1 bg-red-500 text-white rounded text-sm">
              Clear All
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-sm text-gray-500">No items to display</p>
          ) : (
            <div>
              <p className="text-sm mb-1">Items ({items.length}):</p>
              <ul className="text-sm">
                {items.map((item, index) => (
                  <li key={index} className="list-disc list-inside">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
