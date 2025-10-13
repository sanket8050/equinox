"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Users, DollarSign, Calendar, Building, Calculator } from "lucide-react"

interface Group {
  id: string
  name: string
  type: string
  departments: string[]
  members: Array<{
    id: string
    user: { id: string; name: string }
    department?: string
  }>
}

interface Participant {
  userId: string
  userName: string
  share: number
  customShare: boolean
}

const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transportation", 
  "Accommodation",
  "Entertainment",
  "Supplies",
  "Equipment",
  "Marketing",
  "Decoration",
  "Volunteer",
  "Other"
]

export default function AddExpenseEnhanced() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [group, setGroup] = useState<Group | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    paidBy: "",
    category: "",
    department: "",
    notes: ""
  })

  const [participants, setParticipants] = useState<Participant[]>([])
  const [sharingMode, setSharingMode] = useState<"equal" | "custom">("equal")
  const [totalCustomShare, setTotalCustomShare] = useState(0)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated" && typeof window !== "undefined") {
      const groupId = window.location.pathname.split("/")[2]
      fetchGroupData(groupId)
    }
  }, [status])

  useEffect(() => {
    if (group) {
      // Initialize participants with equal shares
      const initialParticipants = group.members.map(member => ({
        userId: member.user.id,
        userName: member.user.name,
        share: 0,
        customShare: false
      }))
      setParticipants(initialParticipants)
    }
  }, [group])

  useEffect(() => {
    if (sharingMode === "equal" && participants.length > 0 && formData.amount) {
      const amountPerPerson = parseFloat(formData.amount) / participants.length
      setParticipants(prev => prev.map(p => ({ ...p, share: amountPerPerson, customShare: false })))
    }
  }, [sharingMode, formData.amount, participants.length])

  useEffect(() => {
    const total = participants.reduce((sum, p) => sum + p.share, 0)
    setTotalCustomShare(total)
  }, [participants])

  const fetchGroupData = async (groupId: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}`)
      if (!response.ok) throw new Error("Failed to fetch group")
      const data = await response.json()
      setGroup(data.group)
    } catch (error) {
      console.error("Error fetching group:", error)
      setError("Failed to load group data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!group) return

    setIsSubmitting(true)
    setError("")

    try {
      // Validate custom shares if in custom mode
      if (sharingMode === "custom") {
        const amount = parseFloat(formData.amount)
        if (Math.abs(totalCustomShare - amount) > 0.01) {
          setError("Custom shares must equal total amount")
          setIsSubmitting(false)
          return
        }
      }

      const customShares = sharingMode === "custom" 
        ? participants.reduce((acc, p) => ({ ...acc, [p.userId]: p.share }), {})
        : undefined

      const response = await fetch(`/api/groups/${group.id}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          participants: participants.map(p => p.userId),
          customShares
        }),
      })

      if (response.ok) {
        router.push(`/groups/${group.id}`)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to add expense")
      }
    } catch (error) {
      console.error("Error adding expense:", error)
      setError("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleParticipantToggle = (userId: string) => {
    setParticipants(prev => prev.map(p => 
      p.userId === userId ? { ...p, customShare: !p.customShare } : p
    ))
  }

  const handleShareChange = (userId: string, share: number) => {
    setParticipants(prev => prev.map(p => 
      p.userId === userId ? { ...p, share } : p
    ))
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (!group) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              href={`/groups/${group.id}`}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Group
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add Expense</h1>
              <p className="text-gray-600">Add a new expense to {group.name}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Expense Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <input
                  type="text"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="What was this expense for?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="amount"
                  required
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {EXPENSE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {group.type === "ORGANIZATION" && group.departments.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select department</option>
                  {group.departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Additional notes about this expense..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Who Paid */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Who Paid?
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paid By *
              </label>
              <select
                name="paidBy"
                required
                value={formData.paidBy}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select member</option>
                {group.members.map((member) => (
                  <option key={member.id} value={member.user.id}>
                    {member.user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Participants and Sharing */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Split Among Participants
            </h2>

            {/* Sharing Mode Toggle */}
            <div className="mb-6">
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setSharingMode("equal")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    sharingMode === "equal"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Equal Split
                </button>
                <button
                  type="button"
                  onClick={() => setSharingMode("custom")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    sharingMode === "custom"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Custom Split
                </button>
              </div>
            </div>

            {/* Participants List */}
            <div className="space-y-4">
              {participants.map((participant) => (
                <div key={participant.userId} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={participant.customShare}
                      onChange={() => handleParticipantToggle(participant.userId)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{participant.userName}</p>
                    {group.type === "ORGANIZATION" && participant.department && (
                      <p className="text-xs text-gray-500">{participant.department}</p>
                    )}
                  </div>

                  {participant.customShare && sharingMode === "custom" && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={participant.share}
                        onChange={(e) => handleShareChange(participant.userId, parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  {!participant.customShare && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${participant.share.toFixed(2)}
                      </p>
                      {sharingMode === "equal" && (
                        <p className="text-xs text-gray-500">Equal share</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Share Summary */}
            {sharingMode === "custom" && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total Share:</span>
                  <span className={`text-lg font-bold ${
                    Math.abs(totalCustomShare - parseFloat(formData.amount || "0")) < 0.01
                      ? "text-green-600"
                      : "text-red-600"
                  }`}>
                    ${totalCustomShare.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Must equal total amount: ${parseFloat(formData.amount || "0").toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href={`/groups/${group.id}`}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || (sharingMode === "custom" && Math.abs(totalCustomShare - parseFloat(formData.amount || "0")) > 0.01)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Adding Expense..." : "Add Expense"}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
