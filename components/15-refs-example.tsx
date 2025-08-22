"use client"

import type React from "react"

import { useRef, useImperativeHandle, forwardRef, useState, useEffect } from "react"

// Forward ref example
const FancyInput = forwardRef<HTMLInputElement, { placeholder?: string }>(function FancyInput({ placeholder }, ref) {
  return (
    <input
      ref={ref}
      type="text"
      placeholder={placeholder}
      className="px-3 py-2 border-2 border-blue-300 rounded-lg focus:border-blue-500 outline-none"
    />
  )
})

// Component with imperative handle
interface CustomInputHandle {
  focus: () => void
  clear: () => void
  getValue: () => string
  setValue: (value: string) => void
}

const CustomInput = forwardRef<CustomInputHandle, { label: string }>(function CustomInput({ label }, ref) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState("")

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus()
    },
    clear: () => {
      setValue("")
      inputRef.current?.focus()
    },
    getValue: () => {
      return value
    },
    setValue: (newValue: string) => {
      setValue(newValue)
    },
  }))

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="px-3 py-2 border rounded-lg w-full"
      />
    </div>
  )
})

// Video player component with ref
function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    // This would be called during video playback
  }

  return (
    <div className="space-y-2">
      <video ref={videoRef} width="300" height="200" onTimeUpdate={handleTimeUpdate} className="border rounded">
        <source src="/placeholder.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <button onClick={togglePlay} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  )
}

// Canvas drawing component
function CanvasDrawing() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.strokeStyle = "#3B82F6"

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.beginPath()
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        width={300}
        height={200}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border border-gray-300 rounded cursor-crosshair"
      />
      <button onClick={clearCanvas} className="px-3 py-1 bg-red-500 text-white rounded text-sm">
        Clear Canvas
      </button>
    </div>
  )
}

export default function RefsExample() {
  // Basic useRef for DOM elements
  const inputRef = useRef<HTMLInputElement>(null)
  const divRef = useRef<HTMLDivElement>(null)

  // useRef for storing mutable values
  const countRef = useRef(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Forward ref
  const fancyInputRef = useRef<HTMLInputElement>(null)

  // Custom input with imperative handle
  const customInputRef = useRef<CustomInputHandle>(null)

  // State for examples
  const [count, setCount] = useState(0)
  const [bgColor, setBgColor] = useState("bg-gray-100")

  // Focus input
  const focusInput = () => {
    inputRef.current?.focus()
  }

  // Scroll to div
  const scrollToDiv = () => {
    divRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Change background color
  const changeBackground = () => {
    const colors = ["bg-red-100", "bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-purple-100"]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    setBgColor(randomColor)
  }

  // Increment without re-render
  const incrementWithoutRerender = () => {
    countRef.current += 1
    console.log("Count ref value:", countRef.current)
  }

  // Start timer
  const startTimer = () => {
    if (timerRef.current) return

    timerRef.current = setInterval(() => {
      setCount((prev) => prev + 1)
    }, 1000)
  }

  // Stop timer
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  // Focus fancy input
  const focusFancyInput = () => {
    fancyInputRef.current?.focus()
  }

  // Custom input actions
  const focusCustomInput = () => {
    customInputRef.current?.focus()
  }

  const clearCustomInput = () => {
    customInputRef.current?.clear()
  }

  const getCustomInputValue = () => {
    const value = customInputRef.current?.getValue()
    alert(`Custom input value: ${value}`)
  }

  const setCustomInputValue = () => {
    customInputRef.current?.setValue("Hello from parent!")
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">15. Refs Example</h3>
      <div className="space-y-4">
        {/* Basic useRef for DOM access */}
        <div className="p-3 bg-blue-50 rounded">
          <h4 className="font-medium mb-2">Basic useRef - DOM Access</h4>
          <div className="space-y-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Click button to focus me"
              className="px-2 py-1 border rounded w-full"
            />
            <button onClick={focusInput} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
              Focus Input
            </button>
          </div>
        </div>

        {/* useRef for mutable values */}
        <div className="p-3 bg-green-50 rounded">
          <h4 className="font-medium mb-2">useRef - Mutable Values</h4>
          <div className="space-y-2">
            <p className="text-sm">State count: {count}</p>
            <p className="text-sm">Ref count: {countRef.current} (check console)</p>
            <div className="space-x-2">
              <button onClick={() => setCount(count + 1)} className="px-3 py-1 bg-green-500 text-white rounded text-sm">
                Increment State
              </button>
              <button onClick={incrementWithoutRerender} className="px-3 py-1 bg-green-600 text-white rounded text-sm">
                Increment Ref (No Re-render)
              </button>
            </div>
          </div>
        </div>

        {/* Timer with useRef */}
        <div className="p-3 bg-yellow-50 rounded">
          <h4 className="font-medium mb-2">Timer with useRef</h4>
          <div className="space-y-2">
            <p className="text-sm">Timer count: {count}</p>
            <div className="space-x-2">
              <button onClick={startTimer} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">
                Start Timer
              </button>
              <button onClick={stopTimer} className="px-3 py-1 bg-red-500 text-white rounded text-sm">
                Stop Timer
              </button>
            </div>
          </div>
        </div>

        {/* Forward ref */}
        <div className="p-3 bg-purple-50 rounded">
          <h4 className="font-medium mb-2">forwardRef Example</h4>
          <div className="space-y-2">
            <FancyInput ref={fancyInputRef} placeholder="Fancy input with forward ref" />
            <button onClick={focusFancyInput} className="px-3 py-1 bg-purple-500 text-white rounded text-sm">
              Focus Fancy Input
            </button>
          </div>
        </div>

        {/* useImperativeHandle */}
        <div className="p-3 bg-pink-50 rounded">
          <h4 className="font-medium mb-2">useImperativeHandle Example</h4>
          <div className="space-y-2">
            <CustomInput ref={customInputRef} label="Custom Input" />
            <div className="space-x-2">
              <button onClick={focusCustomInput} className="px-2 py-1 bg-pink-500 text-white rounded text-sm">
                Focus
              </button>
              <button onClick={clearCustomInput} className="px-2 py-1 bg-red-500 text-white rounded text-sm">
                Clear
              </button>
              <button onClick={getCustomInputValue} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">
                Get Value
              </button>
              <button onClick={setCustomInputValue} className="px-2 py-1 bg-green-500 text-white rounded text-sm">
                Set Value
              </button>
            </div>
          </div>
        </div>

        {/* Canvas drawing */}
        <div className="p-3 bg-indigo-50 rounded">
          <h4 className="font-medium mb-2">Canvas with useRef</h4>
          <CanvasDrawing />
          <p className="text-xs text-gray-600 mt-2">Click and drag to draw</p>
        </div>

        {/* Video player */}
        <div className="p-3 bg-orange-50 rounded">
          <h4 className="font-medium mb-2">Video Player with useRef</h4>
          <VideoPlayer />
          <p className="text-xs text-gray-600 mt-2">Video player controls using ref</p>
        </div>

        {/* Scroll to element */}
        <div className="p-3 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">Scroll to Element</h4>
          <button onClick={scrollToDiv} className="px-3 py-1 bg-gray-500 text-white rounded text-sm mb-2">
            Scroll to Target Div
          </button>
          <div className="h-32 overflow-y-auto border rounded p-2">
            <div className="h-20 bg-gray-200 rounded mb-2 flex items-center justify-center">
              <span className="text-sm">Scroll content 1</span>
            </div>
            <div className="h-20 bg-gray-200 rounded mb-2 flex items-center justify-center">
              <span className="text-sm">Scroll content 2</span>
            </div>
            <div
              ref={divRef}
              className={`h-20 ${bgColor} rounded mb-2 flex items-center justify-center transition-colors`}
            >
              <span className="text-sm font-medium">🎯 Target Div</span>
            </div>
            <div className="h-20 bg-gray-200 rounded mb-2 flex items-center justify-center">
              <span className="text-sm">Scroll content 4</span>
            </div>
          </div>
          <button onClick={changeBackground} className="px-3 py-1 bg-indigo-500 text-white rounded text-sm mt-2">
            Change Target Background
          </button>
        </div>

        {/* Refs best practices */}
        <div className="p-3 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">Refs Best Practices</h4>
          <div className="text-sm space-y-1">
            <p>✅ Use refs for DOM manipulation (focus, scroll, measure)</p>
            <p>✅ Store mutable values that don't trigger re-renders</p>
            <p>✅ Access third-party DOM libraries</p>
            <p>✅ Store timer IDs, subscription IDs</p>
            <p>❌ Don't use refs for data that should trigger re-renders</p>
            <p>❌ Don't read/write ref.current during rendering</p>
            <p>❌ Avoid overusing refs - prefer React's declarative approach</p>
          </div>
        </div>
      </div>
    </div>
  )
}
