"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Minus } from "lucide-react"

interface GroupMember {
  id: string
  user: {
    id: string
    name: string
  }
}

interface Group {
  id: string
  name: string
  members: GroupMember[]
}

export default function AddExpense() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const groupId = params.id as string
  
  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    paidBy: "",
    participants: [] as string[]
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id && groupId) {
      fetchGroup()
    }
  }, [session, groupId])

  const fetchGroup = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}`)
      if (response.ok) {
        const data = await response.json()
        setGroup(data.group)
        // Set current user as default payer
        const currentUser = data.group.members.find((m: GroupMember) => 
          m.user.name === session?.user?.name
        )
        if (currentUser) {
          setFormData(prev => ({
            ...prev,
            paidBy: currentUser.user.id,
            participants: data.group.members.map((m: GroupMember) => m.user.id)
          }))
        }
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error fetching group:", error)
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    if (formData.participants.length === 0) {
      setError("Please select at least one participant")
      setSubmitting(false)
      return
    }

    try {
      const response = await fetch(`/api/groups/${groupId}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: formData.description,
          amount: parseFloat(formData.amount),
          date: formData.date,
          paidBy: formData.paidBy,
          participants: formData.participants
        }),
      })

      if (response.ok) {
        router.push(`/groups/${groupId}`)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to add expense")
      }
    } catch (error) {
      setError("Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const toggleParticipant = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.includes(userId)
        ? prev.participants.filter(id => id !== userId)
        : [...prev.participants, userId]
    }))
  }

  const selectAllParticipants = () => {
    if (!group) return
    setFormData(prev => ({
      ...prev,
      participants: group.members.map(m => m.user.id)
    }))
  }

  const clearAllParticipants = () => {
    setFormData(prev => ({
      ...prev,
      participants: []
    }))
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || !group) {
    return null
  }

  const amountPerPerson = formData.participants.length > 0 && formData.amount 
    ? (parseFloat(formData.amount) / formData.participants.length).toFixed(2)
    : "0.00"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                href={`/groups/${groupId}`}
                className="mr-4 p-2 text-gray-400 hover:text-gray-500"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Add Expense</h1>
                <p className="mt-1 text-sm text-gray-500">
                  {group.name}
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

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  id="description"
                  required
                  className="mt-1 block w-full px-3 py-2 border text-green-700 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Dinner at restaurant, Gas for road trip"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount ($)
                </label>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  required
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full px-3 py-2 border text-green-700 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleInputChange}
                />
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  required
                  className="mt-1 block w-full px-3 py-2 border text-green-700 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>

              {/* Paid By */}
              <div>
                <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700">
                  Paid By
                </label>
                <select
                  name="paidBy"
                  id="paidBy"
                  required
                  className="mt-1 block w-full px-3 py-2 border text-green-700 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.paidBy}
                  onChange={handleInputChange}
                >
                  <option value="">Select who paid</option>
                  {group.members.map((member) => (
                    <option key={member.id} value={member.user.id}>
                      {member.user.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Participants */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Split Between
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={selectAllParticipants}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={clearAllParticipants}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {group.members.map((member) => (
                    <label key={member.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.participants.includes(member.user.id)}
                        onChange={() => toggleParticipant(member.user.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-900">
                        {member.user.name}
                      </span>
                    </label>
                  ))}
                </div>

                {formData.participants.length > 0 && formData.amount && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>Amount per person:</strong> ${amountPerPerson}
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <Link
                  href={`/groups/${groupId}`}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting || !formData.description || !formData.amount || !formData.paidBy || formData.participants.length === 0}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {submitting ? "Adding..." : "Add Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
