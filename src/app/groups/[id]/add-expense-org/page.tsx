"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, DollarSign, Users } from "lucide-react"
import LogoutButton from "@/components/logout-button"

interface GroupMember {
  id: string
  role: "ADMIN" | "MEMBER"
  user: { id: string; name: string }
  department?: string
}

interface Transaction {
  id: string
  amount: number
  isDeleted: boolean
  participants: { userId: string; paid: number }[]
  department: string
}

interface InitialContribution {
  id: string
  amount: number
}

interface Donation {
  id: string
  amount: number
}

interface Group {
  id: string
  name: string
  type: "FRIENDS" | "ORGANIZATION"
  code: string
  departments: string[]
  members: GroupMember[]
  initialContributions: InitialContribution[]
  donations: Donation[]
  transactions: Transaction[]
}

interface StatCardProps {
  title: string
  value: string
  icon: React.ElementType
  color?: string
}

function StatCard({ title, value, icon: Icon, color = "blue-100" }: StatCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg backdrop-blur-sm bg-opacity-80">
      <div className="p-4 flex items-center">
        <div className={`flex-shrink-0 bg-${color} rounded-full p-2`}>
          <Icon className={`h-5 w-5 text-${color.replace("100", "600")}`} />
        </div>
        <div className="ml-4 flex-1">
          <dt className="text-sm font-medium text-gray-600 truncate">{title}</dt>
          <dd className="text-lg font-semibold text-gray-900">{value}</dd>
        </div>
      </div>
    </div>
  )
}

export default function AddExpenseOrg() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { id: groupId } = useParams() as { id: string }

  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [userRole, setUserRole] = useState<"ADMIN" | "MEMBER" | null>(null)
  const [userDepartment, setUserDepartment] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    paidBy: "",
  })

  useEffect(() => {
    if (!session?.user?.id || !groupId) return
    const fetchGroup = async () => {
      try {
        const res = await fetch(`/api/groups/${groupId}`)
        if (!res.ok) return setLoading(false)
        const data = await res.json()
        if (data.group.type !== "ORGANIZATION") return setLoading(false)

        setGroup({
          ...data.group,
          initialContributions: data.group.initialContributions || [],
          donations: data.group.donations || [],
          transactions: data.group.transactions || [],
          members: data.group.members || []
        })

        const currentUser = data.group.members?.find((m: GroupMember) => m.user.id === session.user.id)
        if (currentUser) {
          setUserRole(currentUser.role)
          setUserDepartment(currentUser.department || null)
          setFormData(prev => ({
            ...prev,
            paidBy: currentUser.user.id
          }))
        }
        setLoading(false)
      } catch {
        setLoading(false)
      }
    }
    fetchGroup()
  }, [session, groupId])

  useEffect(() => {
    if (!loading && (!session || !group || group.type !== "ORGANIZATION" || !userRole )) {
      router.push(`/groups/${groupId}`)
    }
    // Optional: Restrict to admins only by uncommenting:
    // if (!loading && userRole !== "ADMIN") router.push(`/groups/${groupId}`)
  }, [loading, session, group, userRole, userDepartment, router, groupId])

  const calculateMetrics = (group: Group | null) => {
    const totalCollected = 
      (group?.initialContributions?.reduce((sum, c) => sum + Number(c.amount), 0) || 0) +
      (group?.donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0)
    const totalSpent = group?.transactions?.reduce((sum, t) => t.isDeleted ? sum : sum + Number(t.amount), 0) || 0
    const remainingBalance = totalCollected - totalSpent
    const userSpent = group?.transactions?.flatMap(t => t.participants || [])
      .filter(p => p.userId === session?.user?.id)
      .reduce((sum, p) => sum + Number(p.paid), 0) || 0
    return { totalCollected, totalSpent, remainingBalance, userSpent }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    if (!formData.description || !formData.amount || !formData.paidBy || !userDepartment) {
      setError("Please fill in all required fields")
      setSubmitting(false)
      return
    }

    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount")
      setSubmitting(false)
      return
    }

    const { remainingBalance } = calculateMetrics(group)
    if (amount > remainingBalance) {
      setError(`Expense exceeds available balance ($${remainingBalance.toFixed(2)})`)
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch(`/api/groups/${groupId}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: formData.description,
          amount,
          date: formData.date,
          paidBy: formData.paidBy,
          department: userDepartment
        }),
      })
      if (res.ok) router.push(`/groups/${groupId}`)
      else {
        const err = await res.json()
        setError(err.error || "Failed to add expense")
      }
    } catch {
      setError("An error occurred while adding the expense")
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const { totalCollected, totalSpent, remainingBalance, userSpent } = calculateMetrics(group)

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <Link href={`/groups/${groupId}`} className="mr-4 p-2 text-gray-600 hover:text-gray-800 transition-transform hover:scale-105">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Add Organization Expense</h1>
              <p className="mt-2 text-sm text-gray-600">{group?.name || "Organization"}</p>
            </div>
          </div>
          <LogoutButton variant="icon" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg backdrop-blur-sm bg-opacity-80 mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Overview</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <StatCard title="Total Collected" value={`$${totalCollected.toFixed(2)}`} icon={DollarSign} color="blue-100" />
              <StatCard title="Total Spent" value={`$${totalSpent.toFixed(2)}`} icon={DollarSign} color="red-100" />
              <StatCard title="Remaining Balance" value={`$${remainingBalance.toFixed(2)}`} icon={DollarSign} color="green-100" />
              <StatCard title="Your Spending" value={`$${userSpent.toFixed(2)}`} icon={Users} color="purple-100" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg backdrop-blur-sm bg-opacity-80 p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>
          )}

          <div className="relative group">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
            <input
              type="text"
              name="description"
              id="description"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Office supplies, Marketing campaign"
              value={formData.description}
              onChange={handleChange}
            />
            <span className="absolute hidden group-hover:block -top-8 left-0 bg-gray-800 text-white text-xs rounded py-1 px-2">
              Enter a brief description of the expense
            </span>
          </div>

          <div className="relative group">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount ($) *</label>
            <input
              type="number"
              name="amount"
              id="amount"
              required
              step="0.01"
              min="0.01"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder={`e.g., 100.00 (max: $${remainingBalance.toFixed(2)})`}
              value={formData.amount}
              onChange={handleChange}
            />
            <span className="absolute hidden group-hover:block -top-8 left-0 bg-gray-800 text-white text-xs rounded py-1 px-2">
              Enter the expense amount (max: ${remainingBalance.toFixed(2)})
            </span>
          </div>

          <div className="relative group">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date *</label>
            <input
              type="date"
              name="date"
              id="date"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.date}
              onChange={handleChange}
            />
            <span className="absolute hidden group-hover:block -top-8 left-0 bg-gray-800 text-white text-xs rounded py-1 px-2">
              Select the date of the expense
            </span>
          </div>

          <div className="relative group">
            <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700">Paid By *</label>
            <select
              name="paidBy"
              id="paidBy"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.paidBy}
              onChange={handleChange}
            >
              <option value="">Select who paid</option>
              {group?.members?.map(m => (
                <option key={m.id} value={m.user.id}>{m.user.name}</option>
              ))}
            </select>
            <span className="absolute hidden group-hover:block -top-8 left-0 bg-gray-800 text-white text-xs rounded py-1 px-2">
              Select the member who paid for this expense
            </span>
          </div>

          <div className="flex justify-end gap-3">
            <Link
              href={`/groups/${groupId}`}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-transform hover:scale-105"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || !formData.description || !formData.amount || !formData.paidBy || !userDepartment}
              className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-transform hover:scale-105"
            >
              {submitting ? "Adding..." : "Add Expense"}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}


//==========================================================================

