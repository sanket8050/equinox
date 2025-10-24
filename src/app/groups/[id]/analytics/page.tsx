"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, DollarSign, Users, TrendingUp, TrendingDown, Building, Plus,Annoyed } from "lucide-react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Group {
  id: string
  name: string
  type: string
  departments: string[]
  members: Array<{
    id: string
    user: { name: string }
    department?: string
    balance: number
  }>
}

interface FundData {
  totalCollected: number
  totalSpent: number
  remainingBalance: number
  contributions: Array<{
    id: string
    amount: number
    date: string
    user: { name: string }
  }>
}

interface DonationData {
  donations: Array<{
    id: string
    donorName: string
    amount: number
    paymentMethod: string
    date: string
    recipient?: { name: string }
    receivedByUser?: { name: string }
  }>
  totalDonations: number
  totalAmount: number
  donationsByMethod: Array<{
    paymentMethod: string
    _sum: { amount: number }
    _count: { id: number }
  }>
}

interface DepartmentAnalytics {
  departments: string[]
  analytics: Array<{
    name: string
    totalSpent: number
    transactionCount: number
    transactions: Array<{
      id: string
      description: string
      amount: number
      date: string
    }>
  }>
}

export default function OrganizationAnalytics() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [group, setGroup] = useState<Group | null>(null)
  const [fundData, setFundData] = useState<FundData | null>(null)
  const [donationData, setDonationData] = useState<DonationData | null>(null)
  const [departmentAnalytics, setDepartmentAnalytics] = useState<DepartmentAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

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

  const fetchGroupData = async (groupId: string) => {
    try {
      setIsLoading(true)
      
      // Fetch group details
      const groupResponse = await fetch(`/api/groups/${groupId}`)
      if (!groupResponse.ok) throw new Error("Failed to fetch group")
      const groupData = await groupResponse.json()
      setGroup(groupData.group)

      // Fetch fund data
      const fundResponse = await fetch(`/api/groups/${groupId}/contributions`)
      if (fundResponse.ok) {
        const fundData = await fundResponse.json()
        setFundData(fundData)
      }

      // Fetch donation data
      const donationResponse = await fetch(`/api/groups/${groupId}/donations`)
      if (donationResponse.ok) {
        const donationData = await donationResponse.json()
        setDonationData(donationData)
      }

      // Fetch department analytics
      const departmentResponse = await fetch(`/api/groups/${groupId}/departments`)
      if (departmentResponse.ok) {
        const departmentData = await departmentResponse.json()
        setDepartmentAnalytics(departmentData)
      }

    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Failed to load analytics data")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
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

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">This page is only available for organization groups</p>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  const paymentMethodData = donationData?.donationsByMethod.map((item, index) => ({
    name: item.paymentMethod.replace('_', ' '),
    value: Number(item._sum.amount),
    count: item._count.id,
    color: COLORS[index % COLORS.length]
  })) || []

  const departmentData = departmentAnalytics?.analytics.map((dept, index) => ({
    name: dept.name,
    amount: dept.totalSpent,
    transactions: dept.transactionCount,
    color: COLORS[index % COLORS.length]
  })) || []

  return (
    <div className="min-h-screen bg-gray-50">

      
      {group.type !== "organisation" ? (<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full flex flex-col items-center">
        {/* Icon section */}
        <div className="flex justify-center w-full mb-2">
          <Annoyed className="h-16 w-16 text-blue-500" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          This page is only for organizations
        </h2>

        {/* Description */}
        <p className="text-gray-500 mt-2 text-center">
          Please go back to your previous page or return home.
        </p>

        {/* Button */}
        <button
          onClick={() => router.back()}
          className="mt-5 inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </button>
      </div>
    </div>):
      
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
                <h1 className="text-3xl font-bold text-gray-900">{group.name} Analytics</h1>
                <p className="text-gray-600">Organization fund tracking and analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">{group.type}</span>
            </div>
          </div>
        </div>

        {/* Fund Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Collected</p>
                <p className="text-2xl font-bold text-green-600">
                  ${fundData?.totalCollected.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-red-600">
                  ${fundData?.totalSpent.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Remaining Balance</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${fundData?.remainingBalance.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Department Spending Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Spending</h3>
            {departmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No department spending data available
              </div>
            )}
          </div>

          {/* Payment Methods Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Donations by Payment Method</h3>
            {paymentMethodData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(Number(percent) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No donation data available
              </div>
            )}
          </div>
        </div>

        {/* Recent Donations */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Donations</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {donationData?.donations.slice(0, 10).map((donation) => (
              <div key={donation.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{donation.donorName}</p>
                    <p className="text-sm text-gray-500">
                      {donation.paymentMethod.replace('_', ' ')} • 
                      {donation.recipient && ` Received by: ${donation.recipient.name}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">+${donation.amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(donation.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )) || []}
            {(!donationData?.donations || donationData.donations.length === 0) && (
              <div className="px-6 py-8 text-center text-gray-500">
                No donations recorded yet
              </div>
            )}
          </div>
        </div>

        {/* Department Details */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Department Details</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {departmentAnalytics?.analytics.map((dept) => (
              <div key={dept.name} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{dept.name}</p>
                    <p className="text-sm text-gray-500">{dept.transactionCount} transactions</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-600">${dept.totalSpent.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )) || []}
            {(!departmentAnalytics?.analytics || departmentAnalytics.analytics.length === 0) && (
              <div className="px-6 py-8 text-center text-gray-500">
                No departments configured yet
              </div>
            )}
          </div>
        </div>
      </div>
      
      }
    </div>
  )
}
