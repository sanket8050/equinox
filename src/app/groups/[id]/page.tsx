"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Users, DollarSign, TrendingUp, Settings, Share2, Calculator, Filter } from "lucide-react"
import LogoutButton from "@/components/logout-button"

interface GroupMember {
  id: string
  role: "ADMIN" | "MEMBER"
  balance: number
  department?: string
  user: {
    name: string
  }
}

interface Transaction {
  id: string
  description: string
  amount: number
  date: string
  addedBy: {
    name: string
  }
  participants: {
    userId: string
    paid: number
    owed: number
  }[]
}

interface Group {
  id: string
  name: string
  type: "FRIENDS" | "ORGANIZATION"
  code: string
  members: GroupMember[]
  transactions: Transaction[]
}

export default function GroupDetail() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const groupId = params.id as string
  
  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"transactions" | "members" | "analytics">("transactions")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")

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

  const userMember = group.members.find(m => m.user.name === session.user?.name)
  const totalSpent = group.transactions.reduce((sum, t) => sum + Number(t.amount), 0)
  const totalMembers = group.members.length

  const tabs = [
    { id: "transactions", label: "Transactions", icon: DollarSign },
    { id: "members", label: "Members", icon: Users },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ]

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
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    group.type === "FRIENDS" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-green-100 text-green-800"
                  }`}>
                    {group.type === "FRIENDS" ? "Friends" : "Organization"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Code: {group.code}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Share2 className="h-5 w-5" />
              </button>
              {userMember?.role === "ADMIN" && (
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <Settings className="h-5 w-5" />
                </button>
              )}
              <LogoutButton variant="icon" />
              <div className="flex space-x-3">
                <Link
                  href={`/groups/${groupId}/settlement`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Settlement
                </Link>
                {group.type === "ORGANIZATION" && (
                  <Link
                    href={`/groups/${groupId}/contributions`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Contributions
                  </Link>
                )}
                <Link
                  href={`/groups/${groupId}/add-expense`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Spent
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      ${totalSpent.toFixed(2)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Members
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {totalMembers}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Your Balance
                    </dt>
                    <dd className={`text-lg font-medium ${userMember?.balance && userMember.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${Math.abs(userMember?.balance || 0).toFixed(2)}
                      {userMember?.balance && userMember.balance < 0 && " owed"}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Transactions
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {group.transactions.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "transactions" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Recent Transactions
                  </h3>
                  {group.type === "ORGANIZATION" && (
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-gray-400" />
                      <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1"
                      >
                        <option value="all">All Departments</option>
                        {Array.from(new Set(group.members.map(m => m.department).filter(Boolean))).map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                {group.transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by adding your first expense.
                    </p>
                    <div className="mt-6">
                      <Link
                        href={`/groups/${groupId}/add-expense`}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Expense
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {group.transactions.map((transaction) => (
                      <div key={transaction.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {transaction.description}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Added by {transaction.addedBy.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(transaction.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-medium text-gray-900">
                              ${Number(transaction.amount).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "members" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Group Members
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.members.map((member) => (
                    <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {member.user.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {member.role === "ADMIN" ? "Admin" : "Member"}
                            {member.department && ` • ${member.department}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${
                            Number(member.balance) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            ${Math.abs(Number(member.balance)).toFixed(2)}
                            {Number(member.balance) < 0 && " owed"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Analytics
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  View detailed analytics and insights for this group.
                </p>
                <Link
                  href={`/groups/${groupId}/analytics`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Full Analytics
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
