"use client"

import React from "react"

// Function Component
function FunctionComponent() {
  return <div className="p-4 bg-blue-50 rounded">Function Component</div>
}

// Arrow Function Component
const ArrowFunctionComponent = () => {
  return <div className="p-4 bg-green-50 rounded">Arrow Function Component</div>
}

// Class Component
class ClassComponent extends React.Component {
  render() {
    return <div className="p-4 bg-yellow-50 rounded">Class Component</div>
  }
}

export default function BasicComponents() {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">1. Basic Components</h3>
      <div className="space-y-2">
        <FunctionComponent />
        <ArrowFunctionComponent />
        <ClassComponent />
      </div>
    </div>
  )
}
