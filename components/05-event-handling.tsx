"use client"

import type React from "react"

import { useState } from "react"

export default function EventHandling() {
  const [message, setMessage] = useState("")
  const [clickCount, setClickCount] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [inputValue, setInputValue] = useState("")
  const [selectedOption, setSelectedOption] = useState("")

  // Click event handler
  const handleClick = () => {
    setClickCount((prev) => prev + 1)
    setMessage("Button clicked!")
  }

  // Mouse event handlers
  const handleMouseEnter = () => {
    setMessage("Mouse entered!")
  }

  const handleMouseLeave = () => {
    setMessage("Mouse left!")
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  // Form event handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(`Form submitted with: ${inputValue}`)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value)
  }

  // Keyboard event handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setMessage("Enter key pressed!")
    }
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">5. Event Handling</h3>
      <div className="space-y-4">
        {/* Message display */}
        <div className="p-2 bg-gray-100 rounded text-sm">Message: {message || "No events yet"}</div>

        {/* Click events */}
        <div className="p-3 bg-blue-50 rounded">
          <h4 className="font-medium mb-2">Click Events</h4>
          <button onClick={handleClick} className="px-3 py-1 bg-blue-500 text-white rounded text-sm mr-2">
            Click me ({clickCount})
          </button>
          <button
            onClick={() => setMessage("Inline handler clicked!")}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm"
          >
            Inline Handler
          </button>
        </div>

        {/* Mouse events */}
        <div className="p-3 bg-yellow-50 rounded">
          <h4 className="font-medium mb-2">Mouse Events</h4>
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            className="p-4 bg-yellow-200 rounded cursor-pointer"
          >
            Hover over me! Mouse: ({mousePosition.x}, {mousePosition.y})
          </div>
        </div>

        {/* Form events */}
        <div className="p-3 bg-green-50 rounded">
          <h4 className="font-medium mb-2">Form Events</h4>
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type and press Enter"
              className="px-2 py-1 border rounded text-sm w-full"
            />
            <select
              value={selectedOption}
              onChange={handleSelectChange}
              className="px-2 py-1 border rounded text-sm w-full"
            >
              <option value="">Select an option</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
            <button type="submit" className="px-3 py-1 bg-green-500 text-white rounded text-sm">
              Submit
            </button>
          </form>
          {selectedOption && <p className="text-sm mt-2">Selected: {selectedOption}</p>}
        </div>
      </div>
    </div>
  )
}
