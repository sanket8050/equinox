  "use client"

  import { useSession } from "next-auth/react"
  import { useRouter } from "next/navigation"
  import { useEffect, useState } from "react"
  import { useParams } from "next/navigation"
  import Link from "next/link"
  import { ArrowLeft, Calculator, CheckCircle, AlertCircle, TrendingUp, TrendingDown, Users, DollarSign } from "lucide-react"

  interface GroupMember {
    id: string
    role: "ADMIN" | "MEMBER"
    balance: number
    user: {
      name: string
    }
  }

  interface Group {
    id: string
    name: string
    members: GroupMember[]
  }

  interface SettlementTransaction {
    from: string
    to: string
    amount: number
    fromName: string
    toName: string
  }

  export default function Settlement() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const params = useParams()
    const groupId = params.id as string
    
    const [group, setGroup] = useState<Group | null>(null)
    const [loading, setLoading] = useState(true)
    const [settling, setSettling] = useState(false)
    const [settlements, setSettlements] = useState<SettlementTransaction[]>([])
    const [error, setError] = useState("")

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

    const handleSettle = async () => {
    setSettling(true)
    setError("")

      try {
        const response = await fetch(`/api/groups/${groupId}/settle`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ groupId }), // include body (even if not used)
        })

        if (response.ok) {
          const data = await response.json()
          setSettlements(data.settlements || [])
          await fetchGroup() // Refresh group data
        } else {
          const errorData = await response.json()
          setError(errorData.error || "Failed to settle group")
        }
      } catch (error) {
        setError("Something went wrong")
      } finally {
        setSettling(false)
      }
    }

    const isGroupSettled = () => {
      if (!group) return false
      return group.members.every(member => Math.abs(member.balance) < 0.01)
    }

    const userMember = group?.members.find(m => m.user.name === session?.user?.name)
    const isAdmin = userMember?.role === "ADMIN"

    const calculateSettlementStats = () => {
      if (!group) return { totalOwed: 0, totalOwing: 0, creditorCount: 0, debtorCount: 0 }

      const creditors = group.members.filter(m => Number(m.balance) > 0)
      const debtors = group.members.filter(m => Number(m.balance) < 0)

      const totalOwed = creditors.reduce((sum, m) => sum + Number(m.balance), 0)
      const totalOwing = Math.abs(debtors.reduce((sum, m) => sum + Number(m.balance), 0))

      return {
        totalOwed,
        totalOwing,
        creditorCount: creditors.length,
        debtorCount: debtors.length
      }
    }


    const stats = calculateSettlementStats()

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
                  <h1 className="text-3xl font-bold text-gray-900">Settlement</h1>
                  <p className="mt-1 text-sm text-gray-500">
                    {group.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Settlement Overview Stats */}
          {!isGroupSettled() && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Owed</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${stats.totalOwed.toFixed(2)}
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
                    <p className="text-sm font-medium text-gray-500">Total Owing</p>
                    <p className="text-2xl font-bold text-red-600">
                      ${stats.totalOwing.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Creditors</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {stats.creditorCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Debtors</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {stats.debtorCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settlement Status */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                {isGroupSettled() ? (
                  <>
                    <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-green-900">
                        Group is Settled
                      </h3>
                      <p className="text-sm text-green-700">
                        All balances are zero. No settlement needed.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-8 w-8 text-orange-500 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-orange-900">
                        Settlement Required
                      </h3>
                      <p className="text-sm text-orange-700">
                        There are outstanding balances that need to be settled.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {!isGroupSettled() && isAdmin && (
                <div className="mt-6">
                  <button
                    onClick={handleSettle}
                    disabled={settling}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    {settling ? "Settling..." : "Settle Group"}
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Current Balances */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Current Balances
              </h3>
              
              {/* Balance Summary */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Your Balance:</span>
                  <span className={`font-bold ${
                    userMember && userMember.balance > 0 
                      ? 'text-green-600' 
                      : userMember && userMember.balance < 0 
                        ? 'text-red-600' 
                        : 'text-gray-600'
                  }`}>
                    {userMember ? `$${Math.abs(userMember.balance).toFixed(2)}` : "$0.00"}
                    {userMember && userMember.balance > 0 && " (you're owed)"}
                    {userMember && userMember.balance < 0 && " (you owe)"}
                    {userMember && userMember.balance === 0 && " (settled)"}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {group.members.map((member) => (
                  <div key={member.id} className={`flex justify-between items-center p-4 rounded-lg border-l-4 ${
                    member.balance > 0 
                      ? 'bg-green-50 border-green-400' 
                      : member.balance < 0 
                        ? 'bg-red-50 border-red-400' 
                        : 'bg-gray-50 border-gray-400'
                  }`}>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        member.balance > 0 
                          ? 'bg-green-500' 
                          : member.balance < 0 
                            ? 'bg-red-500' 
                            : 'bg-gray-400'
                      }`}></div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900">
                            {member.user.name}
                          </span>
                          {member.role === "ADMIN" && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Admin
                            </span>
                          )}
                          {member.user.name === session?.user?.name && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              You
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${
                          member.balance > 0 
                            ? 'text-green-600' 
                            : member.balance < 0 
                              ? 'text-red-600' 
                              : 'text-gray-600'
                        }`}>
                          {member.balance > 0 && "Will receive money"}
                          {member.balance < 0 && "Needs to pay"}
                          {member.balance === 0 && "Settled"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xl font-bold ${
                        member.balance > 0 
                          ? 'text-green-600' 
                          : member.balance < 0 
                            ? 'text-red-600' 
                            : 'text-gray-600'
                      }`}>
                        ${Math.abs(member.balance).toFixed(2)}
                      </span>
                      <p className={`text-xs ${
                        member.balance > 0 
                          ? 'text-green-500' 
                          : member.balance < 0 
                            ? 'text-red-500' 
                            : 'text-gray-500'
                      }`}>
                        {member.balance > 0 && "Owed"}
                        {member.balance < 0 && "Owes"}
                        {member.balance === 0 && "Even"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Settlement Transactions */}
          {settlements.length > 0 && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Settlement Transactions
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  The following transactions will settle all balances:
                </p>
                <div className="space-y-3">
                  {settlements.map((settlement, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center">
                        <span className="font-medium text-green-900">
                          {settlement.fromName}
                        </span>
                        <span className="mx-2 text-green-600">→</span>
                        <span className="font-medium text-green-900">
                          {settlement.toName}
                        </span>
                      </div>
                      <span className="font-bold text-green-700">
                        ${settlement.amount}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Total transactions:</strong> {settlements.length}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Settlement Info */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              How Settlement Works
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Settlement calculates the minimum number of transactions needed</li>
              <li>• Members who owe money pay directly to those who are owed</li>
              <li>• All balances will be reset to zero after settlement</li>
              <li>• Only group admins can trigger settlement</li>
            </ul>
          </div>
        </main>
      </div>
    )
  }
