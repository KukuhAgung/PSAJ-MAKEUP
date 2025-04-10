"use client"

import { X } from "lucide-react"

interface Notification {
  id: string
  type: "success" | "error"
  title: string
  message: string
}

interface NotificationsProps {
  notifications: Notification[]
  dismissNotification: (id: string) => void
}

export function Notifications({ notifications, dismissNotification }: NotificationsProps) {
  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-md shadow-md flex justify-between items-start ${
            notification.type === "success"
              ? "bg-green-100 border-l-4 border-green-500"
              : "bg-red-100 border-l-4 border-red-500"
          }`}
        >
          <div>
            <h4 className={`font-semibold ${notification.type === "success" ? "text-green-800" : "text-red-800"}`}>
              {notification.title}
            </h4>
            <p className={`text-sm ${notification.type === "success" ? "text-green-700" : "text-red-700"}`}>
              {notification.message}
            </p>
          </div>
          <button onClick={() => dismissNotification(notification.id)} className="text-gray-500 hover:text-gray-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

