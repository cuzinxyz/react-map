"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"

// Class component demonstrating lifecycle methods
class LifecycleDemo extends Component<{ name: string }, { count: number; data: string; hasError: boolean }> {
  private timer: NodeJS.Timeout | null = null

  constructor(props: { name: string }) {
    super(props)
    this.state = {
      count: 0,
      data: "",
      hasError: false,
    }
    console.log("1. Constructor called")
  }

  // Mounting phase
  componentDidMount() {
    console.log("3. componentDidMount called")
    // Simulate data fetching
    this.timer = setTimeout(() => {
      this.setState({ data: "Data loaded from API" })
    }, 2000)
  }

  // Updating phase
  componentDidUpdate(prevProps: { name: string }, prevState: { count: number; data: string; hasError: boolean }) {
    console.log("5. componentDidUpdate called")
    console.log("Previous props:", prevProps)
    console.log("Previous state:", prevState)
    console.log("Current props:", this.props)
    console.log("Current state:", this.state)
  }

  // Unmounting phase
  componentWillUnmount() {
    console.log("6. componentWillUnmount called")
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  // Error handling
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log("componentDidCatch called:", error, errorInfo)
    this.setState({ hasError: true })
  }

  // Should component update (performance optimization)
  shouldComponentUpdate(nextProps: { name: string }, nextState: { count: number; data: string; hasError: boolean }) {
    console.log("4. shouldComponentUpdate called")
    // Only update if count or name changes
    return nextState.count !== this.state.count || nextProps.name !== this.props.name
  }

  increment = () => {
    this.setState((prevState) => ({ count: prevState.count + 1 }))
  }

  decrement = () => {
    this.setState((prevState) => ({ count: prevState.count - 1 }))
  }

  reset = () => {
    this.setState({ count: 0 })
  }

  render() {
    console.log("2. Render called")

    if (this.state.hasError) {
      return <div className="text-red-600">Something went wrong!</div>
    }

    return (
      <div className="p-3 bg-blue-50 rounded">
        <h4 className="font-medium mb-2">Class Component Lifecycle</h4>
        <div className="space-y-2">
          <p className="text-sm">Name: {this.props.name}</p>
          <p className="text-sm">Count: {this.state.count}</p>
          <p className="text-sm">Data: {this.state.data || "Loading..."}</p>

          <div className="space-x-2">
            <button onClick={this.increment} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">
              +
            </button>
            <button onClick={this.decrement} className="px-2 py-1 bg-red-500 text-white rounded text-sm">
              -
            </button>
            <button onClick={this.reset} className="px-2 py-1 bg-gray-500 text-white rounded text-sm">
              Reset
            </button>
          </div>
        </div>
      </div>
    )
  }
}

// Class component with all lifecycle methods
class CompleteLifecycleDemo extends Component<{ color: string }, { mounted: boolean; updateCount: number }> {
  constructor(props: { color: string }) {
    super(props)
    this.state = {
      mounted: true,
      updateCount: 0,
    }
    console.log("CompleteLifecycle: Constructor")
  }

  static getDerivedStateFromProps(props: { color: string }, state: { mounted: boolean; updateCount: number }) {
    console.log("CompleteLifecycle: getDerivedStateFromProps")
    // Return new state based on props, or null for no update
    return null
  }

  componentDidMount() {
    console.log("CompleteLifecycle: componentDidMount")
  }

  shouldComponentUpdate(nextProps: { color: string }, nextState: { mounted: boolean; updateCount: number }) {
    console.log("CompleteLifecycle: shouldComponentUpdate")
    return true
  }

  getSnapshotBeforeUpdate(prevProps: { color: string }, prevState: { mounted: boolean; updateCount: number }) {
    console.log("CompleteLifecycle: getSnapshotBeforeUpdate")
    return null
  }

  componentDidUpdate(
    prevProps: { color: string },
    prevState: { mounted: boolean; updateCount: number },
    snapshot: any,
  ) {
    console.log("CompleteLifecycle: componentDidUpdate")
  }

  componentWillUnmount() {
    console.log("CompleteLifecycle: componentWillUnmount")
  }

  forceUpdate = () => {
    this.setState((prevState) => ({ updateCount: prevState.updateCount + 1 }))
  }

  render() {
    console.log("CompleteLifecycle: Render")

    return (
      <div className="p-3 bg-green-50 rounded">
        <h4 className="font-medium mb-2">Complete Lifecycle Methods</h4>
        <div className="space-y-2">
          <p className="text-sm">Color: {this.props.color}</p>
          <p className="text-sm">Update count: {this.state.updateCount}</p>

          <button onClick={this.forceUpdate} className="px-3 py-1 bg-green-500 text-white rounded text-sm">
            Force Update
          </button>
        </div>
      </div>
    )
  }
}

// Error boundary class component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-3 bg-red-50 border border-red-200 rounded">
          <h4 className="font-medium text-red-800 mb-2">Error Boundary Caught an Error</h4>
          <p className="text-sm text-red-600">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm"
          >
            Reset Error
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Component that can throw error
class ErrorThrowingComponent extends Component<{}, { shouldThrow: boolean }> {
  constructor(props: {}) {
    super(props)
    this.state = { shouldThrow: false }
  }

  throwError = () => {
    this.setState({ shouldThrow: true })
  }

  render() {
    if (this.state.shouldThrow) {
      throw new Error("This is a test error!")
    }

    return (
      <div className="p-3 bg-yellow-50 rounded">
        <h4 className="font-medium mb-2">Error Throwing Component</h4>
        <button onClick={this.throwError} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">
          Throw Error
        </button>
      </div>
    )
  }
}

// Main component
export default class ClassComponentLifecycle extends Component<
  {},
  {
    showLifecycle: boolean
    name: string
    color: string
  }
> {
  constructor(props: {}) {
    super(props)
    this.state = {
      showLifecycle: true,
      name: "React Developer",
      color: "blue",
    }
  }

  toggleLifecycle = () => {
    this.setState((prevState) => ({ showLifecycle: !prevState.showLifecycle }))
  }

  changeName = () => {
    this.setState({ name: "Updated Name" })
  }

  changeColor = () => {
    const colors = ["blue", "red", "green", "purple"]
    const currentIndex = colors.indexOf(this.state.color)
    const nextIndex = (currentIndex + 1) % colors.length
    this.setState({ color: colors[nextIndex] })
  }

  render() {
    return (
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">13. Class Component Lifecycle</h3>
        <div className="space-y-4">
          {/* Controls */}
          <div className="p-3 bg-gray-50 rounded">
            <h4 className="font-medium mb-2">Controls</h4>
            <div className="space-x-2">
              <button onClick={this.toggleLifecycle} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                {this.state.showLifecycle ? "Unmount" : "Mount"} Component
              </button>
              <button onClick={this.changeName} className="px-3 py-1 bg-green-500 text-white rounded text-sm">
                Change Name
              </button>
              <button onClick={this.changeColor} className="px-3 py-1 bg-purple-500 text-white rounded text-sm">
                Change Color
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2">Open browser console to see lifecycle method calls</p>
          </div>

          {/* Lifecycle demo */}
          {this.state.showLifecycle && <LifecycleDemo name={this.state.name} />}

          {/* Complete lifecycle demo */}
          <CompleteLifecycleDemo color={this.state.color} />

          {/* Error boundary demo */}
          <ErrorBoundary>
            <ErrorThrowingComponent />
          </ErrorBoundary>

          {/* Lifecycle methods explanation */}
          <div className="p-3 bg-gray-50 rounded">
            <h4 className="font-medium mb-2">Lifecycle Methods Order</h4>
            <div className="text-sm space-y-1">
              <div>
                <strong>Mounting:</strong>
              </div>
              <div>1. constructor()</div>
              <div>2. render()</div>
              <div>3. componentDidMount()</div>

              <div className="mt-2">
                <strong>Updating:</strong>
              </div>
              <div>1. shouldComponentUpdate()</div>
              <div>2. render()</div>
              <div>3. componentDidUpdate()</div>

              <div className="mt-2">
                <strong>Unmounting:</strong>
              </div>
              <div>1. componentWillUnmount()</div>

              <div className="mt-2">
                <strong>Error Handling:</strong>
              </div>
              <div>1. componentDidCatch()</div>
              <div>2. getDerivedStateFromError()</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
