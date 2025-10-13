"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

interface LogoutButtonProps {
  className?: string
  variant?: "button" | "icon"
}

export default function LogoutButton({ className = "", variant = "button" }: LogoutButtonProps) {
  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  if (variant === "icon") {
    return (
      <button
        onClick={handleLogout}
        className={`p-2 text-gray-400 hover:text-gray-500 ${className}`}
        title="Logout"
      >
        <LogOut className="h-5 w-5" />
      </button>
    )
  }

  return (
    <button
      onClick={handleLogout}
      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${className}`}
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </button>
  )
}
