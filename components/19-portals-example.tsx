"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"

// Modal component using portal
function Modal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  if (!mounted || !isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="p-6">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            ✕
          </button>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}

// Tooltip component using portal
function Tooltip({
  children,
  content,
  position = "top",
}: {
  children: React.ReactNode
  content: string
  position?: "top" | "bottom" | "left" | "right"
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()

    let x = rect.left + rect.width / 2
    let y = rect.top

    switch (position) {
      case "bottom":
        y = rect.bottom + 8
        break
      case "left":
        x = rect.left - 8
        y = rect.top + rect.height / 2
        break
      case "right":
        x = rect.right + 8
        y = rect.top + rect.height / 2
        break
      default: // top
        y = rect.top - 8
    }

    setTooltipPosition({ x, y })
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  if (!mounted) {
    return (
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </div>
    )
  }

  return (
    <>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </div>

      {isVisible &&
        createPortal(
          <div
            className="absolute z-50 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg pointer-events-none"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform:
                position === "top" || position === "bottom"
                  ? "translateX(-50%)"
                  : position === "left"
                    ? "translateX(-100%)"
                    : "translateY(-50%)",
            }}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  )
}

// Notification system using portal
interface Notification {
  id: string
  type: "success" | "error" | "warning" | "info"
  message: string
  duration?: number
}

function NotificationContainer({
  notifications,
  onRemove,
}: {
  notifications: Notification[]
  onRemove: (id: string) => void
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} onRemove={onRemove} />
      ))}
    </div>,
    document.body,
  )
}

function NotificationItem({
  notification,
  onRemove,
}: {
  notification: Notification
  onRemove: (id: string) => void
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(notification.id)
    }, notification.duration || 5000)

    return () => clearTimeout(timer)
  }, [notification.id, notification.duration, onRemove])

  const getNotificationStyles = () => {
    switch (notification.type) {
      case "success":
        return "bg-green-500 text-white"
      case "error":
        return "bg-red-500 text-white"
      case "warning":
        return "bg-yellow-500 text-white"
      case "info":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className={`p-3 rounded-lg shadow-lg max-w-sm ${getNotificationStyles()}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm">{notification.message}</p>
        <button onClick={() => onRemove(notification.id)} className="ml-2 text-white hover:text-gray-200">
          ✕
        </button>
      </div>
    </div>
  )
}

// Dropdown menu using portal
function Dropdown({
  trigger,
  children,
}: {
  trigger: React.ReactNode
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [isOpen])

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!isOpen) {
      const rect = e.currentTarget.getBoundingClientRect()
      setPosition({
        x: rect.left,
        y: rect.bottom + 4,
      })
    }

    setIsOpen(!isOpen)
  }

  return (
    <>
      <div onClick={handleTriggerClick}>{trigger}</div>

      {mounted &&
        isOpen &&
        createPortal(
          <div
            className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[150px]"
            style={{
              left: position.x,
              top: position.y,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>,
          document.body,
        )}
    </>
  )
}

// Sidebar using portal
function Sidebar({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!mounted) return null

  return createPortal(
    <div className={`fixed inset-0 z-50 ${isOpen ? "block" : "hidden"}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            ✕
          </button>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default function PortalsExample() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (type: Notification["type"], message: string) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      message,
      duration: 5000,
    }
    setNotifications((prev) => [...prev, notification])
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">19. Portals Example</h3>
      <div className="space-y-4">
        {/* Modal example */}
        <div className="p-3 bg-blue-50 rounded">
          <h4 className="font-medium mb-2">Modal Portal</h4>
          <button onClick={() => setIsModalOpen(true)} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
            Open Modal
          </button>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <h3 className="text-lg font-semibold mb-4">Modal Title</h3>
            <p className="text-sm text-gray-600 mb-4">
              This modal is rendered using React Portal. It's rendered outside the normal component tree but can still
              access props and state from its parent.
            </p>
            <div className="space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
              >
                Close
              </button>
              <button
                onClick={() => {
                  addNotification("success", "Action completed!")
                  setIsModalOpen(false)
                }}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                Confirm
              </button>
            </div>
          </Modal>
        </div>

        {/* Tooltip examples */}
        <div className="p-3 bg-green-50 rounded">
          <h4 className="font-medium mb-2">Tooltip Portal</h4>
          <div className="space-x-4">
            <Tooltip content="This is a top tooltip" position="top">
              <button className="px-3 py-1 bg-green-500 text-white rounded text-sm">Hover (Top)</button>
            </Tooltip>

            <Tooltip content="This is a bottom tooltip" position="bottom">
              <button className="px-3 py-1 bg-green-500 text-white rounded text-sm">Hover (Bottom)</button>
            </Tooltip>

            <Tooltip content="This is a left tooltip" position="left">
              <button className="px-3 py-1 bg-green-500 text-white rounded text-sm">Hover (Left)</button>
            </Tooltip>

            <Tooltip content="This is a right tooltip" position="right">
              <button className="px-3 py-1 bg-green-500 text-white rounded text-sm">Hover (Right)</button>
            </Tooltip>
          </div>
        </div>

        {/* Notification system */}
        <div className="p-3 bg-yellow-50 rounded">
          <h4 className="font-medium mb-2">Notification Portal</h4>
          <div className="space-x-2">
            <button
              onClick={() => addNotification("success", "Success! Operation completed.")}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm"
            >
              Success
            </button>
            <button
              onClick={() => addNotification("error", "Error! Something went wrong.")}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm"
            >
              Error
            </button>
            <button
              onClick={() => addNotification("warning", "Warning! Please check your input.")}
              className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
            >
              Warning
            </button>
            <button
              onClick={() => addNotification("info", "Info: Here is some information.")}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Info
            </button>
          </div>

          <NotificationContainer notifications={notifications} onRemove={removeNotification} />
        </div>

        {/* Dropdown menu */}
        <div className="p-3 bg-purple-50 rounded">
          <h4 className="font-medium mb-2">Dropdown Portal</h4>
          <Dropdown
            trigger={<button className="px-3 py-1 bg-purple-500 text-white rounded text-sm">Open Menu ▼</button>}
          >
            <div className="py-1">
              <button className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100">Profile</button>
              <button className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100">Settings</button>
              <hr className="my-1" />
              <button className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-red-600">
                Logout
              </button>
            </div>
          </Dropdown>
        </div>

        {/* Sidebar */}
        <div className="p-3 bg-pink-50 rounded">
          <h4 className="font-medium mb-2">Sidebar Portal</h4>
          <button onClick={() => setIsSidebarOpen(true)} className="px-3 py-1 bg-pink-500 text-white rounded text-sm">
            Open Sidebar
          </button>

          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
            <h3 className="text-lg font-semibold mb-4">Sidebar Content</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-100 rounded">
                <h4 className="font-medium">Navigation</h4>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>
                    <a href="#" className="text-blue-600 hover:underline">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-gray-100 rounded">
                <h4 className="font-medium">Settings</h4>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2" />
                    Enable notifications
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2" />
                    Dark mode
                  </label>
                </div>
              </div>
            </div>
          </Sidebar>
        </div>

        {/* Portal benefits and use cases */}
        <div className="p-3 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">Portal Benefits & Use Cases</h4>
          <div className="text-sm space-y-1">
            <p>
              <strong>✅ Benefits:</strong>
            </p>
            <p>• Render outside parent DOM hierarchy</p>
            <p>• Avoid CSS overflow/z-index issues</p>
            <p>• Maintain React component tree relationship</p>
            <p>• Event bubbling still works as expected</p>

            <p className="mt-2">
              <strong>🎯 Common use cases:</strong>
            </p>
            <p>• Modals and dialogs</p>
            <p>• Tooltips and popovers</p>
            <p>• Dropdown menus</p>
            <p>• Notifications/toasts</p>
            <p>• Sidebars and drawers</p>
            <p>• Full-screen overlays</p>

            <p className="mt-2">
              <strong>⚠️ Considerations:</strong>
            </p>
            <p>• Server-side rendering compatibility</p>
            <p>• Accessibility (focus management)</p>
            <p>• Event handling across portals</p>
          </div>
        </div>
      </div>
    </div>
  )
}
