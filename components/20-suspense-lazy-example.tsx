"use client"

import type React from "react"

import { Suspense, lazy, useState } from "react"

// Lazy loaded components
const HeavyComponent = lazy(
  () =>
    new Promise((resolve) => {
      // Simulate loading delay
      setTimeout(() => {
        resolve({
          default: function HeavyComponent() {
            return (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <h4 className="font-medium text-blue-800 mb-2">Heavy Component Loaded!</h4>
                <p className="text-sm text-blue-600">This component was loaded lazily and took 2 seconds to load.</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {Array.from({ length: 9 }, (_, i) => (
                    <div key={i} className="p-2 bg-blue-100 rounded text-xs text-center">
                      Item {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            )
          },
        })
      }, 2000)
    }),
)

const ChartComponent = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          default: function ChartComponent() {
            return (
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <h4 className="font-medium text-green-800 mb-2">Chart Component</h4>
                <div className="h-32 bg-green-100 rounded flex items-center justify-center">
                  <div className="text-green-600 text-sm">📊 Chart would render here</div>
                </div>
                <p className="text-xs text-green-600 mt-2">Simulated heavy chart library loaded lazily</p>
              </div>
            )
          },
        })
      }, 1500)
    }),
)

const DataTableComponent = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          default: function DataTableComponent() {
            const data = Array.from({ length: 10 }, (_, i) => ({
              id: i + 1,
              name: `User ${i + 1}`,
              email: `user${i + 1}@example.com`,
              role: i % 2 === 0 ? "Admin" : "User",
            }))

            return (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded">
                <h4 className="font-medium text-purple-800 mb-2">Data Table Component</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-purple-100">
                        <th className="p-2 text-left">ID</th>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Email</th>
                        <th className="p-2 text-left">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row) => (
                        <tr key={row.id} className="border-t border-purple-200">
                          <td className="p-2">{row.id}</td>
                          <td className="p-2">{row.name}</td>
                          <td className="p-2">{row.email}</td>
                          <td className="p-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                row.role === "Admin" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {row.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          },
        })
      }, 1000)
    }),
)

// Loading components
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span className="ml-2 text-sm text-gray-600">Loading...</span>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="h-8 bg-gray-300 rounded"></div>
        ))}
      </div>
    </div>
  )
}

function ChartLoadingSkeleton() {
  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="h-32 bg-gray-300 rounded mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-3/4"></div>
    </div>
  )
}

function TableLoadingSkeleton() {
  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
      <div className="space-y-2">
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-8 bg-gray-300 rounded"></div>
          ))}
        </div>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }, (_, j) => (
              <div key={j} className="h-6 bg-gray-200 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// Error boundary for lazy components
function LazyErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded">
      <h4 className="font-medium text-red-800 mb-2">Failed to load component</h4>
      <p className="text-sm text-red-600 mb-2">The component failed to load. This could be due to network issues.</p>
      <button onClick={() => window.location.reload()} className="px-3 py-1 bg-red-500 text-white rounded text-sm">
        Retry
      </button>
    </div>
  )
}

// Nested suspense example
function NestedSuspenseExample() {
  return (
    <div className="space-y-4">
      <Suspense fallback={<LoadingSkeleton />}>
        <HeavyComponent />

        <Suspense fallback={<ChartLoadingSkeleton />}>
          <ChartComponent />
        </Suspense>
      </Suspense>

      <Suspense fallback={<TableLoadingSkeleton />}>
        <DataTableComponent />
      </Suspense>
    </div>
  )
}

export default function SuspenseLazyExample() {
  const [showHeavy, setShowHeavy] = useState(false)
  const [showChart, setShowChart] = useState(false)
  const [showTable, setShowTable] = useState(false)
  const [showNested, setShowNested] = useState(false)

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">20. Suspense & Lazy Loading</h3>
      <div className="space-y-4">
        {/* Controls */}
        <div className="p-3 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">Load Components</h4>
          <div className="space-x-2 mb-2">
            <button
              onClick={() => setShowHeavy(!showHeavy)}
              className={`px-3 py-1 rounded text-sm ${showHeavy ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              {showHeavy ? "Hide" : "Load"} Heavy Component
            </button>
            <button
              onClick={() => setShowChart(!showChart)}
              className={`px-3 py-1 rounded text-sm ${showChart ? "bg-green-500 text-white" : "bg-gray-200"}`}
            >
              {showChart ? "Hide" : "Load"} Chart Component
            </button>
            <button
              onClick={() => setShowTable(!showTable)}
              className={`px-3 py-1 rounded text-sm ${showTable ? "bg-purple-500 text-white" : "bg-gray-200"}`}
            >
              {showTable ? "Hide" : "Load"} Data Table
            </button>
          </div>
          <button
            onClick={() => setShowNested(!showNested)}
            className={`px-3 py-1 rounded text-sm ${showNested ? "bg-orange-500 text-white" : "bg-gray-200"}`}
          >
            {showNested ? "Hide" : "Show"} Nested Suspense Example
          </button>
        </div>

        {/* Individual lazy components */}
        <div className="space-y-4">
          {showHeavy && (
            <Suspense fallback={<LoadingSkeleton />}>
              <HeavyComponent />
            </Suspense>
          )}

          {showChart && (
            <Suspense fallback={<ChartLoadingSkeleton />}>
              <ChartComponent />
            </Suspense>
          )}

          {showTable && (
            <Suspense fallback={<TableLoadingSkeleton />}>
              <DataTableComponent />
            </Suspense>
          )}
        </div>

        {/* Nested suspense example */}
        {showNested && (
          <div className="p-3 bg-orange-50 rounded">
            <h4 className="font-medium mb-2">Nested Suspense Example</h4>
            <NestedSuspenseExample />
          </div>
        )}

        {/* Different loading states */}
        <div className="p-3 bg-yellow-50 rounded">
          <h4 className="font-medium mb-2">Different Loading States</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium mb-2">Spinner Loading</h5>
              <Suspense fallback={<LoadingSpinner />}>{showHeavy && <HeavyComponent />}</Suspense>
            </div>

            <div>
              <h5 className="text-sm font-medium mb-2">Skeleton Loading</h5>
              <Suspense fallback={<LoadingSkeleton />}>{showChart && <ChartComponent />}</Suspense>
            </div>
          </div>
        </div>

        {/* Suspense best practices */}
        <div className="p-3 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">Suspense & Lazy Loading Best Practices</h4>
          <div className="text-sm space-y-1">
            <p>
              <strong>✅ Good use cases:</strong>
            </p>
            <p>• Large components that aren't immediately needed</p>
            <p>• Route-based code splitting</p>
            <p>• Heavy third-party libraries (charts, editors)</p>
            <p>• Components behind user interactions</p>

            <p className="mt-2">
              <strong>✅ Loading state best practices:</strong>
            </p>
            <p>• Use skeleton screens for better UX</p>
            <p>• Match loading state size to actual content</p>
            <p>• Provide meaningful loading messages</p>
            <p>• Handle loading errors gracefully</p>

            <p className="mt-2">
              <strong>⚠️ Considerations:</strong>
            </p>
            <p>• Don't over-split - balance bundle size vs requests</p>
            <p>• Consider preloading for critical components</p>
            <p>• Test loading states thoroughly</p>
            <p>• Handle network failures</p>

            <p className="mt-2">
              <strong>🔄 Modern patterns:</strong>
            </p>
            <p>• Nested Suspense boundaries</p>
            <p>• Concurrent features with Suspense</p>
            <p>• Data fetching with Suspense (React 18+)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
