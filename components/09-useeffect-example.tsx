"use client"

import { useState, useEffect } from "react"

export default function UseEffectExample() {
  const [count, setCount] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [windowWidth, setWindowWidth] = useState(0)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Effect 1: Component did mount (runs once)
  useEffect(() => {
    console.log("Component mounted")
    setWindowWidth(window.innerWidth)

    // Cleanup function (component will unmount)
    return () => {
      console.log("Component will unmount")
    }
  }, []) // Empty dependency array = runs once

  // Effect 2: Timer (runs on mount, cleanup on unmount)
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)

    // Cleanup function to clear interval
    return () => clearInterval(timer)
  }, []) // Empty dependency array

  // Effect 3: Runs when count changes
  useEffect(() => {
    document.title = `Count: ${count}`

    // Cleanup (optional for this case)
    return () => {
      document.title = "React App"
    }
  }, [count]) // Dependency array with count

  // Effect 4: Window resize listener
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup event listener
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, []) // Empty dependency array

  // Effect 5: Fetch data when component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, []) // Empty dependency array

  // Effect 6: Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Effect 7: Search effect (runs when debouncedSearch changes)
  useEffect(() => {
    if (debouncedSearch) {
      console.log("Searching for:", debouncedSearch)
      // Here you would typically make an API call
    }
  }, [debouncedSearch])

  // Effect 8: Conditional effect
  useEffect(() => {
    if (count > 0 && count % 5 === 0) {
      alert(`Count reached ${count}!`)
    }
  }, [count])

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">9. useEffect Examples</h3>
      <div className="space-y-4">
        {/* Timer */}
        <div className="p-3 bg-blue-50 rounded">
          <h4 className="font-medium mb-2">Timer (useEffect with cleanup)</h4>
          <p className="text-sm">Seconds elapsed: {seconds}</p>
        </div>

        {/* Counter with document title update */}
        <div className="p-3 bg-green-50 rounded">
          <h4 className="font-medium mb-2">Counter (useEffect with dependency)</h4>
          <p className="text-sm mb-2">Count: {count} (Check document title)</p>
          <div className="space-x-2">
            <button onClick={() => setCount(count + 1)} className="px-3 py-1 bg-green-500 text-white rounded text-sm">
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

        {/* Window width */}
        <div className="p-3 bg-yellow-50 rounded">
          <h4 className="font-medium mb-2">Window Resize Listener</h4>
          <p className="text-sm">Window width: {windowWidth}px</p>
          <p className="text-xs text-gray-600">Try resizing your browser window</p>
        </div>

        {/* Data fetching */}
        <div className="p-3 bg-purple-50 rounded">
          <h4 className="font-medium mb-2">Data Fetching (API Call)</h4>
          {loading ? (
            <p className="text-sm">Loading posts...</p>
          ) : (
            <div className="space-y-2">
              {posts.map((post) => (
                <div key={post.id} className="p-2 bg-white rounded border text-sm">
                  <h5 className="font-medium">{post.title}</h5>
                  <p className="text-gray-600 text-xs">{post.body.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Debounced search */}
        <div className="p-3 bg-pink-50 rounded">
          <h4 className="font-medium mb-2">Debounced Search</h4>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type to search (debounced)..."
            className="w-full px-2 py-1 border rounded text-sm mb-2"
          />
          <p className="text-sm">Search term: {searchTerm}</p>
          <p className="text-sm">Debounced search: {debouncedSearch}</p>
          <p className="text-xs text-gray-600">Search executes 500ms after you stop typing</p>
        </div>

        {/* useEffect patterns summary */}
        <div className="p-3 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">useEffect Patterns Summary</h4>
          <div className="text-xs space-y-1">
            <div>
              <code>useEffect(() =&gt; {`{}`}, [])</code> - Runs once on mount
            </div>
            <div>
              <code>useEffect(() =&gt; {`{}`})</code> - Runs on every render
            </div>
            <div>
              <code>useEffect(() =&gt; {`{}`}, [dep])</code> - Runs when dep changes
            </div>
            <div>
              <code>useEffect(() =&gt; {`{ return () => {} }`})</code> - With cleanup
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
