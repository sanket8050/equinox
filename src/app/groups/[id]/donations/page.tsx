"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Search, Filter, DollarSign, Calendar, User, CreditCard } from "lucide-react"

interface Group {
  id: string
  name: string
  type: string
  members: Array<{
    id: string
    user: { id: string; name: string }
    department?: string
  }>
}

interface Donation {
  id: string
  donorName: string
  donorEmail?: string
  amount: number
  paymentMethod: string
  date: string
  notes?: string
  recipient?: { name: string }
  receivedByUser?: { name: string }
}

interface DonationData {
  donations: Donation[]
  totalDonations: number
  totalAmount: number
  donationsByMethod: Array<{
    paymentMethod: string
    _sum: { amount: number }
    _count: { id: number }
  }>
  pagination: {
    page: number
    limit: number
    totalPages: number
  }
}

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "CARD", label: "Card" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "ONLINE", label: "Online" },
  { value: "CHEQUE", label: "Cheque" },
  { value: "OTHER", label: "Other" }
]

export default function DonationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [group, setGroup] = useState<Group | null>(null)
  const [donationData, setDonationData] = useState<DonationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterMethod, setFilterMethod] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Add donation form state
  const [formData, setFormData] = useState({
    donorName: "",
    donorEmail: "",
    amount: "",
    paymentMethod: "CASH",
    recipientId: "",
    notes: ""
  })

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
      fetchDonations()
    }
  }, [group, currentPage, searchTerm, filterMethod])

  const fetchGroupData = async (groupId: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}`)
      if (!response.ok) throw new Error("Failed to fetch group")
      const data = await response.json()
      setGroup(data.group)
    } catch (error) {
      console.error("Error fetching group:", error)
      setError("Failed to load group data")
    }
  }

  const fetchDonations = async () => {
    if (!group) return
    
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20"
      })
      
      if (searchTerm) params.append("search", searchTerm)
      if (filterMethod) params.append("method", filterMethod)

      const response = await fetch(`/api/groups/${group.id}/donations?${params}`)
      if (!response.ok) throw new Error("Failed to fetch donations")
      
      const data = await response.json()
      setDonationData(data)
      console.log(data);
    } catch (error) {
      console.error("Error fetching donations:", error)
      setError("Failed to load donations")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddDonation = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!group) return

    try {
      const response = await fetch(`/api/groups/${group.id}/donations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        }),
      })

      if (response.ok) {
        setShowAddModal(false)
        setFormData({
          donorName: "",
          donorEmail: "",
          amount: "",
          paymentMethod: "CASH",
          recipientId: "",
          notes: ""
        })
        fetchDonations()
      } else {
        const errorData = await response.json()
        alert(errorData.error || "Failed to add donation")
      }
    } catch (error) {
      console.error("Error adding donation:", error)
      alert("Failed to add donation")
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading donations...</p>
        </div>
      </div>
    )
  }

  if (error) {
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

  if (!group || group.type !== "ORGANIZATION") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Donations are only available for organization groups</p>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const filteredDonations = donationData?.donations.filter(donation => {
    const matchesSearch = donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.donorEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = !filterMethod || donation.paymentMethod === filterMethod
    return matchesSearch && matchesFilter
  }) || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href={`/groups/${group.id}`}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Group
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Donations</h1>
                <p className="text-gray-600">Track and manage donations for {group.name}</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Donation
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Donations</p>
                <p className="text-2xl font-bold text-green-600">
                  ${Number(donationData?.totalAmount ?? 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Donors</p>
                <p className="text-2xl font-bold text-blue-600">
                  {donationData?.totalDonations || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Payment Methods</p>
                <p className="text-2xl font-bold text-purple-600">
                  {donationData?.donationsByMethod.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by donor name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Payment Methods</option>
                {PAYMENT_METHODS.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Donations List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Donations</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredDonations.map((donation) => (
              <div key={donation.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{donation.donorName}</p>
                        {donation.donorEmail && (
                          <p className="text-sm text-gray-500">{donation.donorEmail}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <CreditCard className="h-4 w-4" />
                        <span>{donation.paymentMethod.replace('_', ' ')}</span>
                      </div>
                      {donation.recipient && (
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <User className="h-4 w-4" />
                          <span>Received by: {donation.recipient.name}</span>
                        </div>
                      )}
                    </div>
                    {donation.notes && (
                      <p className="text-sm text-gray-600 mt-1">{donation.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">+${Number(donation?.amount ?? 0).toFixed(2)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(donation.date).toLocaleDateString()}
                    </p>
                    {donation.receivedByUser && (
                      <p className="text-xs text-gray-400">
                        Recorded by: {donation.receivedByUser.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filteredDonations.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">
                {searchTerm || filterMethod ? "No donations match your filters" : "No donations recorded yet"}
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {donationData && donationData.pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm text-gray-700">
                Page {currentPage} of {donationData.pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(donationData.pagination.totalPages, prev + 1))}
                disabled={currentPage === donationData.pagination.totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Donation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Donation</h3>
            
            <form onSubmit={handleAddDonation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Donor Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.donorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, donorName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Donor Email
                </label>
                <input
                  type="email"
                  value={formData.donorEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, donorEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method *
                </label>
                <select
                  required
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Received By (Optional)
                </label>
                <select
                  value={formData.recipientId}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipientId: e.target.value }))}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Donation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
