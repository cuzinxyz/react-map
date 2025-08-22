"use client"

export default function JSXExamples() {
  const name = "React Developer"
  const isLoggedIn = true
  const numbers = [1, 2, 3, 4, 5]

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">2. JSX Examples</h3>
      <div className="space-y-2">
        {/* JSX Expression */}
        <p className="text-sm">Hello, {name}!</p>

        {/* JSX with JavaScript expressions */}
        <p className="text-sm">2 + 2 = {2 + 2}</p>

        {/* JSX with conditional rendering */}
        <p className="text-sm">Status: {isLoggedIn ? "Logged In" : "Logged Out"}</p>

        {/* JSX with array mapping */}
        <div className="flex gap-2">
          {numbers.map((num) => (
            <span key={num} className="px-2 py-1 bg-blue-100 rounded text-xs">
              {num}
            </span>
          ))}
        </div>

        {/* JSX with inline styles */}
        <div style={{ color: "red", fontWeight: "bold" }}>Inline styled text</div>

        {/* JSX with className */}
        <div className="text-green-600 font-medium">CSS class styled text</div>
      </div>
    </div>
  )
}
