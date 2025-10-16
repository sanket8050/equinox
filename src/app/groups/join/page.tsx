"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Users, CheckCircle, XCircle } from "lucide-react"

export default function JoinGroup() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [groupCode, setGroupCode] = useState("")
  const [department, setDepartment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [groupInfo, setGroupInfo] = useState<any>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (!groupCode.trim()) {
      setError("Please enter a group code")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/groups/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: groupCode.toUpperCase(),
          department: department.trim(),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setGroupInfo(data.group)

        // If organization and department is not yet provided
        if (data.group.type === "ORGANIZATION" && !department.trim()) {
          setSuccess("Please enter your department to continue")
          setIsLoading(false)
          return
        }

        // Success flow
        setSuccess("Successfully joined the group!")
        setTimeout(() => {
          router.push(`/groups/${data.group.id}`)
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to join group")
      }
    } catch (error) {
      console.error(error)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    setGroupCode(value)
    setError("")
    setSuccess("")
    setGroupInfo(null)
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

  if (!session) return null

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
                <h1 className="text-3xl font-bold text-gray-900">Join Group</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Enter a group code to join an existing group
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Form */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center">
                  <XCircle className="h-5 w-5 mr-2" />
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  {success}
                </div>
              )}

              {/* Group Code Input */}
              <div>
                <label
                  htmlFor="groupCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Group Code
                </label>
                <input
                  type="text"
                  id="groupCode"
                  required
                  maxLength={6}
                  className="mt-1 block w-full px-3 py-2 border text-gray-500 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-2xl font-mono tracking-widest"
                  placeholder="ABC123"
                  value={groupCode}
                  onChange={handleCodeChange}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Ask a group member for the 6-character group code
                </p>
              </div>

              {/* Department Input (only for Organization) */}
              {groupInfo?.type === "ORGANIZATION" && (
                <div>
                  <label
                    htmlFor="department"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Department
                  </label>
                  <input
                    type="text"
                    id="department"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Marketing, Engineering, Finance"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Specify your department for better organization
                  </p>
                </div>
              )}

              {/* Group Info Preview */}
              {groupInfo && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-blue-900">
                        {groupInfo.name}
                      </h3>
                      <p className="text-sm text-blue-700">
                        {groupInfo.type === "FRIENDS"
                          ? "Friends Group"
                          : "Organization Group"}{" "}
                        • {groupInfo.members?.length || 0} members
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                  disabled={isLoading || !groupCode.trim()}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading
                    ? "Joining..."
                    : groupInfo?.type === "ORGANIZATION" && !department.trim()
                    ? "Continue"
                    : "Join Group"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Need Help?
            </h3>
            <div className="space-y-3"> 
              {[
                "Ask a group member for the 6-character group code",
                "Enter the code above and click 'Join Group'",
                "You'll be redirected to the group dashboard",
              ].map((text, i) => (
                <div key={i} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                      {i + 1}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
