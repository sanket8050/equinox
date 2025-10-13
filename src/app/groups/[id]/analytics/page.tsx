"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, TrendingUp, Users, DollarSign } from "lucide-react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface GroupMember {
  id: string
  role: "ADMIN" | "MEMBER"
  balance: number
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
  members: GroupMember[]
  transactions: Transaction[]
}

export default function Analytics() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const groupId = params.id as string
  
  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)

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

  // Prepare data for charts
  const memberBalanceData = group.members.map(member => ({
    name: member.user.name,
    balance: Number(member.balance),
    absBalance: Math.abs(Number(member.balance))
  }))

  const transactionData = group.transactions.map(transaction => ({
    name: transaction.description,
    amount: Number(transaction.amount),
    date: new Date(transaction.date).toLocaleDateString()
  }))

  const monthlyData = group.transactions.reduce((acc, transaction) => {
    const month = new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    const existing = acc.find(item => item.month === month)
    
    if (existing) {
      existing.amount += Number(transaction.amount)
      existing.count += 1
    } else {
      acc.push({
        month,
        amount: Number(transaction.amount),
        count: 1
      })
    }
    
    return acc
  }, [] as { month: string; amount: number; count: number }[])

  const totalSpent = group.transactions.reduce((sum, t) => sum + Number(t.amount), 0)
  const avgTransaction = group.transactions.length > 0 ? totalSpent / group.transactions.length : 0

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

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
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                <p className="mt-1 text-sm text-gray-500">
                  {group.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
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
                  <TrendingUp className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Avg Transaction
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      ${avgTransaction.toFixed(2)}
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
                      {group.members.length}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Member Balances Chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Member Balances
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={memberBalanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Balance']} />
                <Bar dataKey="balance" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Spending Chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Monthly Spending
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                <Bar dataKey="amount" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Recent Transactions
            </h3>
            <div className="space-y-3">
              {group.transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      by {transaction.addedBy.name} • {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ${Number(transaction.amount).toFixed(2)}
                  </span>
                </div>
              ))}
              {group.transactions.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No transactions yet
                </p>
              )}
            </div>
          </div>

          {/* Member Summary */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Member Summary
            </h3>
            <div className="space-y-3">
              {group.members.map((member) => (
                <div key={member.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {member.user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {member.role === "ADMIN" ? "Admin" : "Member"}
                    </p>
                  </div>
                  <span className={`text-sm font-medium ${
                    Number(member.balance) > 0 
                      ? 'text-green-600' 
                      : Number(member.balance) < 0 
                        ? 'text-red-600' 
                        : 'text-gray-600'
                  }`}>
                    ${Math.abs(Number(member.balance)).toFixed(2)}
                    {Number(member.balance) > 0 && " owed"}
                    {Number(member.balance) < 0 && " owes"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
