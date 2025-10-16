"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Users, Building } from "lucide-react"

export default function CreateGroup() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    type: "FRIENDS" as "FRIENDS" | "ORGANIZATION",
    description: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/groups/${data.group.id}`)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to create group")
      }
    } catch (error) {
      setError("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTypeChange = (type: "FRIENDS" | "ORGANIZATION") => {
    setFormData(prev => ({
      ...prev,
      type
    }))
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="mr-4 p-2 text-gray-400 hover:text-gray-500"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create Group</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Start managing expenses with friends or organization
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Group Type Selection */}
              <div>
                <label className="text-base font-medium text-gray-900">
                  Group Type
                </label>
                <p className="text-sm text-gray-500">
                  Choose the type of group you want to create
                </p>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div
                    className={`relative rounded-lg p-4 border-2 cursor-pointer transition-colors ${
                      formData.type === "FRIENDS"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleTypeChange("FRIENDS")}
                  >
                    <div className="flex items-center">
                      <Users className={`h-6 w-6 ${
                        formData.type === "FRIENDS" ? "text-blue-600" : "text-gray-400"
                      }`} />
                      <div className="ml-3">
                        <h3 className={`text-sm font-medium ${
                          formData.type === "FRIENDS" ? "text-blue-900" : "text-gray-900"
                        }`}>
                          Friends
                        </h3>
                        <p className={`text-sm ${
                          formData.type === "FRIENDS" ? "text-blue-700" : "text-gray-500"
                        }`}>
                          Perfect for trips and casual outings
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`relative rounded-lg p-4 border-2 cursor-pointer transition-colors ${
                      formData.type === "ORGANIZATION"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleTypeChange("ORGANIZATION")}
                  >
                    <div className="flex items-center">
                      <Building className={`h-6 w-6 ${
                        formData.type === "ORGANIZATION" ? "text-green-600" : "text-gray-400"
                      }`} />
                      <div className="ml-3">
                        <h3 className={`text-sm font-medium ${
                          formData.type === "ORGANIZATION" ? "text-green-900" : "text-gray-900"
                        }`}>
                          Organization
                        </h3>
                        <p className={`text-sm ${
                          formData.type === "ORGANIZATION" ? "text-green-700" : "text-gray-500"
                        }`}>
                          For events, campaigns, and teams
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Group Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Group Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-green-400 text-green-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Summer Trip 2024, Office Team Lunch"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-green-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of your group..."
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <Link
                  href="/dashboard"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Link> 
                <button
                  type="submit"
                  disabled={isLoading || !formData.name.trim()}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? "Creating..." : "Create Group"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
