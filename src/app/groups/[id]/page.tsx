// "use client"

// import { useSession } from "next-auth/react"
// import { useRouter, useParams } from "next/navigation"
// import { useEffect, useMemo, useState, Dispatch, SetStateAction } from "react"
// import Link from "next/link"
// import Stats from "@/components/new/stats"
// import {
//   ArrowLeft,
//   Plus,
//   Users,
//   DollarSign,
//   TrendingUp,
//   Settings,
//   Share2,
//   Calculator,
//   Filter,
//   Building,
//   Trash2,
// } from "lucide-react"
// import LogoutButton from "@/components/logout-button"

// // Recharts
// import {
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip as ReTooltip,
//   Legend,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
// } from "recharts"

// //
// // Types
// //
// interface GroupMember {
//   id: string
//   userId: string
//   role: "ADMIN" | "MEMBER"
//   balance: string | number
//   department?: string | null
//   joinedAt?: string
//   user: { id?: string; name: string }
// }

// interface TransactionParticipant {
//   userId: string
//   paid: string | number
//   owed: string | number
// }

// interface Transaction {
//   id: string
//   description: string
//   amount: string | number
//   date: string
//   addedBy?: { name?: string; id?: string }
//   participants: TransactionParticipant[]
//   isDeleted?: boolean
//   department?: string | null
//   category?: string | null
// }

// interface InitialContribution {
//   id: string
//   userId: string
//   amount: string | number
//   date?: string
// }

// interface Donation {
//   id: string
//   donorName: string
//   amount: string | number
//   date?: string
// }

// interface Group {
//   id: string
//   name: string
//   type: "FRIENDS" | "ORGANIZATION"
//   code: string
//   departments?: string[] | null
//   members: GroupMember[]
//   transactions: Transaction[]
//   initialFunds?: InitialContribution[]
//   donations?: Donation[]
// }

// interface StatCardProps {
//   title: string
//   value: string | number
//   icon: React.ElementType
//   color?: string
// }

// interface TabProps<T extends string> {
//   id: T
//   label: string
//   icon: React.ElementType
//   activeTab: T
//   setActiveTab: Dispatch<SetStateAction<T>>
// }

// //
// // Helpers
// //
// const COLOR_MAP: Record<string, { wrapper: string; iconWrapper: string; icon: string; text: string }> = {
//   "blue-100": { wrapper: "bg-white", iconWrapper: "bg-blue-100", icon: "text-blue-600", text: "text-gray-900" },
//   "green-100": { wrapper: "bg-white", iconWrapper: "bg-green-100", icon: "text-green-600", text: "text-gray-900" },
//   "purple-100": { wrapper: "bg-white", iconWrapper: "bg-purple-100", icon: "text-purple-600", text: "text-gray-900" },
//   "red-100": { wrapper: "bg-white", iconWrapper: "bg-red-100", icon: "text-red-600", text: "text-gray-900" },
//   "gray-400": { wrapper: "bg-white", iconWrapper: "bg-gray-100", icon: "text-gray-400", text: "text-gray-900" },
//   "red-600": { wrapper: "bg-white", iconWrapper: "bg-red-100", icon: "text-red-600", text: "text-gray-900" },
//   "green-600": { wrapper: "bg-white", iconWrapper: "bg-green-100", icon: "text-green-600", text: "text-gray-900" },
// }

// function toNumber(value: any): number {
//   if (value == null) return 0
//   if (typeof value === "number") return value
//   const parsed = parseFloat(String(value))
//   return Number.isFinite(parsed) ? parsed : 0
// }

// function formatCurrency(value: number, locale = "en-US", currency = "USD") {
//   return new Intl.NumberFormat(locale, { style: "currency", currency }).format(value)
// }

// //
// // StatCard
// //
//  export function StatCard({ title, value, icon: Icon, color = "gray-400" }: StatCardProps) {
//   const map = COLOR_MAP[color] ?? COLOR_MAP["gray-400"]

//   return (
//     <div className={`${map.wrapper} overflow-hidden shadow rounded-lg`}>
//       <div className="p-5">
//         <div className="flex items-center">
//           <div className={`flex-shrink-0 ${map.iconWrapper} rounded-full p-3`}>
//             <Icon className={`h-6 w-6 ${map.icon}`} />
//           </div>
//           <div className="ml-5 w-0 flex-1">
//             <dl>
//               <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
//               <dd className={`text-lg font-medium ${map.text}`}>{value}</dd>
//             </dl>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// //
// // Tab
// //
// function Tab<T extends string>({ id, label, icon: Icon, activeTab, setActiveTab }: TabProps<T>) {
//   return (
//     <button
//       onClick={() => setActiveTab(id)}
//       className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
//         activeTab === id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//       }`}
//     >
//       <Icon className="h-4 w-4 mr-2" />
//       {label}
//     </button>
//   )
// }

// //
// // GroupHeader
// //
// function GroupHeader({ group, userMember, isOrg = false }: { group: Group; userMember: GroupMember | undefined; isOrg?: boolean }) {
//   return (
//     <header className="bg-white shadow">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center">
//             <Link href="/dashboard" className="mr-4 p-2 text-gray-400 hover:text-gray-500">
//               <ArrowLeft className="h-5 w-5" />
//             </Link>
//             <div>
//               <div className="flex items-center space-x-3">
//                 <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
//                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isOrg ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
//                   {isOrg ? "Organization" : "Friends"}
//                 </span>
//               </div>
//               <p className="mt-1 text-sm text-gray-500">Code: {group.code}</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-4">
//             <button className="p-2 text-gray-400 hover:text-gray-500">
//               <Share2 className="h-5 w-5" />
//             </button>
//             {userMember?.role === "ADMIN" && (
//               <Link href={`/groups/${group.id}/settings`} className="p-2 text-gray-400 hover:text-gray-500">
//                 <Settings className="h-5 w-5" />
//               </Link>
//             )}
//             <LogoutButton variant="icon" />
//             <div className="flex space-x-3">
//               <Link href={`/groups/${group.id}/settlement`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
//                 <Calculator className="h-4 w-4 mr-2" />
//                 Settlement
//               </Link>
//               {isOrg && (
//                 <Link href={`/groups/${group.id}/donations`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700">
//                   <DollarSign className="h-4 w-4 mr-2" />
//                   Contributions
//                 </Link>
//               )}
//               {isOrg && (
//                 <Link href={`/groups/${group.id}/add-expense-org`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Expense
//               </Link>
//               )}
//               {!isOrg && (
//                 <Link href={`/groups/${group.id}/add-expense`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Expense
//               </Link>
//               )}
              
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }

// //
// // TransactionsList
// //
// function TransactionsList({ group, departmentFilter, isOrg = false }: { group: Group; departmentFilter?: string; isOrg?: boolean }) {
//   const { data: session } = useSession()
//   const router = useRouter()
//   const [deletingId, setDeletingId] = useState<string | null>(null)

//   const filteredTransactions = ((): Transaction[] => {
//     const txs = (group.transactions || []).filter(t => !t.isDeleted)
//     if (!isOrg || departmentFilter === "all" || !departmentFilter) return txs

//     return txs.filter(t => {
//       if (t.department) return t.department === departmentFilter

//       const participantUserId = t.participants?.[0]?.userId
//       if (!participantUserId) return false
//       const member = group.members.find(m => m.userId === participantUserId)
//       return member?.department === departmentFilter
//     })
//   })()

//   const canDeleteTransaction = (transaction: Transaction) => {
//     const userMember = group.members.find(m => m.userId === session?.user?.id)
//     const isAdmin = userMember?.role === "ADMIN"
//     const isCreator = transaction.addedBy?.id && session?.user?.id && transaction.addedBy?.id === session.user.id
//     return Boolean(isAdmin || isCreator)
//   }

//   const handleDelete = async (transactionId: string) => {
//     if (!confirm("Are you sure you want to delete this transaction? This action can be undone by an admin.")) {
//       return
//     }
//     setDeletingId(transactionId)
//     try {
//       const res = await fetch(`/api/groups/${transactionId}/deleteTS`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//       })
//       if (res.ok) {
//         // refresh current route data
         
//         router.refresh()
//       } else {
//         const err = await res.json().catch(() => null)
//         alert(err?.error || "Failed to delete transaction")
//       }
//     } catch (e) {
//       alert("Something went wrong while deleting the transaction")
//     } finally {
//       setDeletingId(null)
      
//     }
//   }

//   return filteredTransactions.length === 0 ? (
//     <div className="text-center py-12">
//       <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
//       <h3 className="mt-2 text-sm font-medium text-gray-900">No {isOrg ? "expenses" : "transactions"} yet</h3>
//       <p className="mt-1 text-sm text-gray-500">Get started by adding your first expense.</p>
//       <Link href={`/groups/${group.id}/add-expense`} className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
//         <Plus className="h-4 w-4 mr-2" /> Add Expense
//       </Link>
//     </div>
//   ) : (
//     <div className="space-y-4">
//       {filteredTransactions.map((transaction) => (
//         <div key={transaction.id} className="border border-gray-200 rounded-lg p-4">
//           <div className="flex justify-between items-start">
//             <div>
//               <h4 className="text-sm font-medium text-gray-900">{transaction.description}</h4>
//               <p className="text-sm text-gray-500">Added by {transaction.addedBy?.name ?? "Unknown"}</p>
//               <p className="text-xs text-gray-400">{new Date(transaction.date).toLocaleDateString()}</p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <p className="text-lg font-medium text-gray-900">{formatCurrency(toNumber(transaction.amount))}</p>
//               {canDeleteTransaction(transaction) && (
//                 <button
//                   onClick={() => handleDelete(transaction.id)}
//                   disabled={deletingId === transaction.id}
//                   title="Delete transaction"
//                   className={`p-2 rounded-md ${deletingId === transaction.id ? "opacity-50 cursor-not-allowed text-gray-400" : "text-gray-400 hover:text-red-500"}`}
//                   aria-label="Delete transaction"
//                 >
//                   <Trash2 className="h-5 w-5" />
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }

// //
// // Friends UI
// //
// function FriendsGroupUI({ group, session, userMember, totalSpent, totalMembers }: {
//   group: Group; session: any; userMember: GroupMember | undefined; totalSpent: number; totalMembers: number
// }) {
//   const [activeTab, setActiveTab] = useState<"transactions" | "members" | "analytics">("transactions")
//   const tabs = [
//     { id: "transactions", label: "Transactions", icon: DollarSign },
//     { id: "members", label: "Members", icon: Users },
//     { id: "analytics", label: "Analytics", icon: TrendingUp },
//   ] as const

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <GroupHeader group={group} userMember={userMember} />
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
//           <StatCard title="Total Spent" value={formatCurrency(totalSpent)} icon={DollarSign} />
//           <StatCard title="Members" value={totalMembers} icon={Users} />
//           <StatCard
//             title="Your Balance"
//             value={`${userMember?.balance ? `${formatCurrency(Math.abs(toNumber(userMember.balance))) }${toNumber(userMember.balance) < 0 ? " owed" : ""}` : formatCurrency(0)}`}
//             icon={TrendingUp}
//             color={userMember?.balance && toNumber(userMember.balance) < 0 ? "red-600" : "green-600"}
//           />
//           <StatCard title="Transactions" value={group.transactions.length} icon={DollarSign} />
//         </div>
//         <div className="bg-white shadow rounded-lg">
//           <div className="border-b border-gray-200">
//             <nav className="-mb-px flex space-x-8 px-6">
//               {tabs.map((tab) => (
//                 <Tab key={tab.id} {...tab} activeTab={activeTab} setActiveTab={setActiveTab} />
//               ))}
//             </nav>
//           </div>
//           <div className="p-6">
//             {activeTab === "transactions" && (
//               <div>
//                 <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
//                 <TransactionsList group={group} />
                
//               </div>
//             )}
//             {activeTab === "members" && (
//               <div>
//                 <h3 className="text-lg font-medium text-gray-900 mb-4">Group Members</h3>
//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                   {group.members.map((member) => (
//                     <div key={member.id} className="border border-gray-200 rounded-lg p-4">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <h4 className="text-sm font-medium text-gray-900">{member.user.name}</h4>
//                           <p className="text-sm text-gray-500">{member.role === "ADMIN" ? "Admin" : "Member"}</p>
//                         </div>
//                         <p className={`text-sm font-medium ${toNumber(member.balance) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                           {formatCurrency(Math.abs(toNumber(member.balance)))}{toNumber(member.balance) < 0 && " owed"}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//             {activeTab === "analytics" && (
//               <div>
//                 <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics</h3>
//                 <p className="text-sm text-gray-500 mb-4">View detailed analytics and insights for this group.</p>
//                 <Link href={`/groups/${group.id}/analytics`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
//                   <TrendingUp className="h-4 w-4 mr-2" /> View Full Analytics
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

// //
// // Organization UI with Charts
// //
// function OrganizationGroupUI({ group, session, userMember, totalSpent, totalMembers, totalCollected, remainingBalance }: {
//   group: Group; session: any; userMember: GroupMember | undefined; totalSpent: number; totalMembers: number;
//   totalCollected: number; remainingBalance: number;
// }) {
//   const [activeTab, setActiveTab] = useState<"transactions" | "members" | "departments" | "analytics">("transactions")
//   const [departmentFilter, setDepartmentFilter] = useState<string>("all")

//   const departments =
//     (group.departments && group.departments.length > 0)
//       ? group.departments
//       : Array.from(new Set((group.members || []).map(m => m.department).filter(Boolean)))

//   const tabs = [
//     { id: "transactions", label: "Transactions", icon: DollarSign },
//     { id: "members", label: "Members", icon: Users },
//     { id: "departments", label: "Departments", icon: Building },
//     { id: "analytics", label: "Analytics", icon: TrendingUp },
//   ] as const

//   //
//   // Chart data computations
//   //
//   // Department spending breakdown (pie)
//   const deptSpending = useMemo(() => {
//     const map: Record<string, number> = {}
//     const txs = (group.transactions || []).filter(t => !t.isDeleted)
//     txs.forEach(t => {
//       const amount = toNumber(t.amount)
//       const dept = t.department ?? group.members.find(m => m.userId === t.participants?.[0]?.userId)?.department ?? "Unassigned"
//       map[dept] = (map[dept] || 0) + amount
//     })
//     return Object.entries(map).map(([name, value]) => ({ name, value }))
//   }, [group.transactions, group.members])

//   // Colors for pie slices
//   const PIE_COLORS = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#F97316"]

//   // Monthly spend for last 6 months (line chart)
//   const monthlySpend = useMemo(() => {
//     const now = new Date()
//     const months: { label: string; year: number; monthIndex: number; total: number }[] = []
//     for (let i = 5; i >= 0; i--) {
//       const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
//       months.push({ label: d.toLocaleString("default", { month: "short" }), year: d.getFullYear(), monthIndex: d.getMonth(), total: 0 })
//     }
//     const txs = (group.transactions || []).filter(t => !t.isDeleted)
//     txs.forEach(t => {
//       const dt = new Date(t.date)
//       const amount = toNumber(t.amount)
//       const monthEntry = months.find(m => m.year === dt.getFullYear() && m.monthIndex === dt.getMonth())
//       if (monthEntry) monthEntry.total += amount
//     })
//     return months.map(m => ({ name: `${m.label}`, value: Math.round(m.total * 100) / 100 }))
//   }, [group.transactions])

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <GroupHeader group={group} userMember={userMember} isOrg={true} />
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
// {/* -          <StatCard title="Total Collected" value={formatCurrency(totalCollected)} icon={DollarSign} color="blue-100" />
// -          <StatCard title="Total Spent" value={formatCurrency(totalSpent)} icon={TrendingUp} color="red-100" />
// -          <StatCard title="Remaining Balance" value={formatCurrency(remainingBalance)} icon={Calculator} color="green-100" />
// -          <StatCard title="Departments" value={departments.length} icon={Building} color="purple-100" /> */}
// +          {/* moved stats into separate component */}
// +          <Stats group={group} totalSpent={totalSpent} departmentsCount={departments.length} />
//         </div>

//         <div className="bg-white shadow-md rounded-lg mb-8">
//           <div className="border-b border-gray-200">
//             <nav className="-mb-px flex space-x-8 px-6">
//               {tabs.map((tab) => (
//                 <Tab key={tab.id} {...tab} activeTab={activeTab} setActiveTab={setActiveTab} />
//               ))}
//             </nav>
//           </div>

//           <div className="p-6">
//             {activeTab === "transactions" && (
//               <div>
//                 <div className="flex justify-between items-center mb-6">
//                   <h3 className="text-xl font-semibold text-gray-900">Recent Expenses</h3>
//                   <div className="flex items-center space-x-3">
//                     <Filter className="h-5 w-5 text-red-600" />
//                     <select
//                       value={departmentFilter}
//                       onChange={(e) => setDepartmentFilter(e.target.value)}
//                       className=" text-sm border-1 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white appearance-none pr-8"
//                     >
//                       <option value="all" >All Departments</option>
//                       {departments.map(dept => <option key={dept} >{dept}</option>)}
//                     </select>
//                   </div>
//                 </div>
//                 <TransactionsList group={group} departmentFilter={departmentFilter} isOrg={true} />
//               </div>
//             )}

//             {activeTab === "members" && (
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-6">Employees</h3>
//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                   {group.members.map((member) => (
//                     <div key={member.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <h4 className="text-base font-medium text-gray-900">{member.user.name}</h4>
//                           <p className="text-sm text-gray-600">{member.role === "ADMIN" ? "Admin" : "Employee"}{member.department && ` • ${member.department}`}</p>
//                         </div>
//                         <p className={`text-base font-semibold ${toNumber(member.balance) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                           {formatCurrency(Math.abs(toNumber(member.balance)))}{toNumber(member.balance) < 0 && " owed"}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {activeTab === "departments" && (
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-6">Departments</h3>
//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                   {departments.map((dept) => {
//                     const deptMembers = (group.members || []).filter(m => m.department === dept)
//                     const deptBalance = deptMembers.reduce((sum, m) => sum + toNumber(m.balance), 0)
//                     const deptSpent = (group.transactions || [])
//                       .filter(t => !t.isDeleted)
//                       .filter(t => t.department ? t.department === dept : (group.members.find(mm => mm.userId === t.participants?.[0]?.userId)?.department === dept))
//                       .reduce((s, t) => s + toNumber(t.amount), 0)

//                     return (
//                       <div key={dept} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <h4 className="text-base font-medium text-gray-900">{dept}</h4>
//                             <p className="text-sm text-gray-600">{deptMembers.length} {deptMembers.length === 1 ? 'Employee' : 'Employees'}</p>
//                             <p className="text-sm text-gray-500 mt-1">Dept Spent: {formatCurrency(deptSpent)}</p>
//                           </div>
//                           <p className={`text-base font-semibold ${deptBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                             {formatCurrency(Math.abs(deptBalance))}{deptBalance < 0 && " owed"}
//                           </p>
//                         </div>
//                       </div>
//                     )
//                   })}
//                 </div>
//               </div>
//             )}

//             {activeTab === "analytics" && (
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-6">Organizational Analytics</h3>
//                 <p className="text-sm text-gray-600 mb-6">Department spending breakdown and recent monthly spending trends.</p>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="bg-white border border-gray-200 rounded-lg p-4">
//                     <h4 className="text-md font-medium text-gray-900 mb-3">Department Spend Breakdown</h4>
//                     {deptSpending.length === 0 ? (
//                       <p className="text-sm text-gray-500">No spending data yet.</p>
//                     ) : (
//                       <ResponsiveContainer width="100%" height={260}>
//                         <PieChart>
//                           <Pie dataKey="value" data={deptSpending} nameKey="name" outerRadius={80} fill="#8884d8" label>
//                             {deptSpending.map((entry, index) => (
//                               <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
//                             ))}
//                           </Pie>
//                           <ReTooltip formatter={(value: any) => formatCurrency(toNumber(value))} />
//                           <Legend />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     )}
//                   </div>

//                   <div className="bg-white border border-gray-200 rounded-lg p-4">
//                     <h4 className="text-md font-medium text-gray-900 mb-3">Monthly Spend (last 6 months)</h4>
//                     {monthlySpend.length === 0 ? (
//                       <p className="text-sm text-gray-500">No spending data yet.</p>
//                     ) : (
//                       <ResponsiveContainer width="100%" height={260}>
//                         <LineChart data={monthlySpend}>
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis dataKey="name" />
//                           <YAxis tickFormatter={(v) => formatCurrency(toNumber(v))} />
//                           <ReTooltip formatter={(value: any) => formatCurrency(toNumber(value))} />
//                           <Legend />
//                           <Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={2} dot />
//                         </LineChart>
//                       </ResponsiveContainer>
//                     )}
//                   </div>
//                 </div>

//                 {/* <div className="mt-6">
//                   <Link href={`/groups/${group.id}/analytics`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700">
//                     <TrendingUp className="h-5 w-5 mr-2" /> View Detailed Analytics
//                   </Link>
//                 </div> */}
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

// //
// // Main component
// //
// export default function GroupDetail() {
//   const { data: session, status } = useSession()
//   const router = useRouter()
//   const params = useParams()
//   const groupId = params?.id as string
//   const [group, setGroup] = useState<Group | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     if (status === "unauthenticated") router.push("/auth/signin")
//   }, [status, router])

//   useEffect(() => {
//     if (session?.user && groupId) {
//       const fetchGroup = async () => {
//         try {
//           const response = await fetch(`/api/groups/${groupId}`)
//           if (response.ok) {
//             const payload = await response.json()
//             setGroup(payload.group)
//           } else {
//             router.push("/dashboard")
//           }
//         } catch (error) {
//           console.error("Error fetching group:", error)
//           router.push("/dashboard")
//         } finally {
//           setLoading(false)
//         }
//       }
//       fetchGroup()
//     }
//   }, [session, groupId, router])

//   if (status === "loading" || loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!session || !group) return null

//   // find current member by session.user.id if available, otherwise fallback to name
//   const userMember = (group.members || []).find(m => m.userId === session.user?.id) ?? (group.members || []).find(m => m.user.name === session.user?.name)

//   // Compute totals
//   const totalSpent = (group.transactions || []).filter(t => !t.isDeleted).reduce((s, t) => s + toNumber(t.amount), 0)
//   const totalMembers = (group.members || []).length
//   const totalInitial = (group.initialFunds || []).reduce((s, c) => s + toNumber((c as any).amount), 0)
//   const totalDonations = (group.donations || []).reduce((s, d) => s + toNumber((d as any).amount), 0)
//   const totalCollected = totalInitial + totalDonations
//   const remainingBalance = totalCollected - totalSpent

//   return group.type === "FRIENDS" ? (
//     <FriendsGroupUI group={group} session={session} userMember={userMember} totalSpent={totalSpent} totalMembers={totalMembers} />
//   ) : (
//     <OrganizationGroupUI
//       group={group}
//       session={session}
//       userMember={userMember}
//       totalSpent={totalSpent}
//       totalMembers={totalMembers}
//       totalCollected={totalCollected}
//       remainingBalance={remainingBalance}
//     />
//   )
// }


//--------------------------------------------------------------------------------------------------
"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useMemo, useState, Dispatch, SetStateAction } from "react"
import Link from "next/link"
import Stats from "@/components/new/stats"
import {
  ArrowLeft,
  Plus,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  Share2,
  Calculator,
  Filter,
  Building,
  Trash2,
} from "lucide-react"
import LogoutButton from "@/components/logout-button"

// Recharts
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

//
// Types
//
interface GroupMember {
  id: string
  userId: string
  role: "ADMIN" | "MEMBER"
  balance: string | number
  department?: string | null
  joinedAt?: string
  user: { id?: string; name: string }
}

interface TransactionParticipant {
  userId: string
  paid: string | number
  owed: string | number
}

interface Transaction {
  id: string
  description: string
  amount: string | number
  date: string
  addedBy?: { name?: string; id?: string }
  participants: TransactionParticipant[]
  isDeleted?: boolean
  department?: string | null
  category?: string | null
}

interface InitialContribution {
  id: string
  userId: string
  amount: string | number
  date?: string
}

interface Donation {
  id: string
  donorName: string
  amount: string | number
  date?: string
}

interface Group {
  id: string
  name: string
  type: "FRIENDS" | "ORGANIZATION"
  code: string
  departments?: string[] | null
  members: GroupMember[]
  transactions: Transaction[]
  initialFunds?: InitialContribution[]
  donations?: Donation[]
}

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  color?: string
}

interface TabProps<T extends string> {
  id: T
  label: string
  icon: React.ElementType
  activeTab: T
  setActiveTab: Dispatch<SetStateAction<T>>
}

//
// Helpers
//
const COLOR_MAP: Record<string, { wrapper: string; iconWrapper: string; icon: string; text: string }> = {
  "blue-100": { wrapper: "bg-zinc-900", iconWrapper: "bg-blue-900/30", icon: "text-blue-400", text: "text-white" },
  "green-100": { wrapper: "bg-zinc-900", iconWrapper: "bg-green-900/30", icon: "text-green-400", text: "text-white" },
  "purple-100": { wrapper: "bg-zinc-900", iconWrapper: "bg-purple-900/30", icon: "text-purple-400", text: "text-white" },
  "red-100": { wrapper: "bg-zinc-900", iconWrapper: "bg-red-900/30", icon: "text-red-400", text: "text-white" },
  "gray-400": { wrapper: "bg-zinc-900", iconWrapper: "bg-zinc-800", icon: "text-gray-300", text: "text-white" },
  "red-600": { wrapper: "bg-zinc-900", iconWrapper: "bg-red-900/30", icon: "text-red-500", text: "text-white" },
  "green-600": { wrapper: "bg-zinc-900", iconWrapper: "bg-green-900/30", icon: "text-green-500", text: "text-white" },
}

function toNumber(value: any): number {
  if (value == null) return 0
  if (typeof value === "number") return value
  const parsed = parseFloat(String(value))
  return Number.isFinite(parsed) ? parsed : 0
}

function formatCurrency(value: number, locale = "en-US", currency = "USD") {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(value)
}

//
// StatCard
//
export function StatCard({ title, value, icon: Icon, color = "gray-400" }: StatCardProps) {
  const map = COLOR_MAP[color] ?? COLOR_MAP["gray-400"]

  return (
    <div className={`${map.wrapper} border border-zinc-800 rounded-2xl p-5`}>
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${map.iconWrapper} rounded-full p-3`}>
          <Icon className={`h-6 w-6 ${map.icon}`} />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm text-gray-400">{title}</dt>
            <dd className={`text-lg font-semibold ${map.text}`}>{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  )
}

//
// Tab
//
function Tab<T extends string>({ id, label, icon: Icon, activeTab, setActiveTab }: TabProps<T>) {
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`py-4 px-1 border-b-2 flex items-center gap-2 transition-all ${
        activeTab === id
          ? "border-blue-500 text-blue-400"
          : "border-transparent text-gray-500 hover:text-gray-300"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

//
// GroupHeader — DARK THEME
//
function GroupHeader({ group, userMember, isOrg = false }: { group: Group; userMember: GroupMember | undefined; isOrg?: boolean }) {
  return (
    <header className="bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 text-gray-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white">{group.name}</h1>
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  isOrg
                    ? "bg-green-900/40 text-green-400"
                    : "bg-blue-900/40 text-blue-400"
                }`}
              >
                {isOrg ? "Organization" : "Friends"}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Code: {group.code}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-white">
            <Share2 className="h-5 w-5" />
          </button>

          {userMember?.role === "ADMIN" && (
            <Link href={`/groups/${group.id}/settings`} className="p-2 text-gray-400 hover:text-white">
              <Settings className="h-5 w-5" />
            </Link>
          )}

          <LogoutButton variant="icon" />

          {/* Buttons */}
          <div className="flex gap-2">
            <Link
              href={`/groups/${group.id}/settlement`}
              className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-500 flex items-center gap-2"
            >
              <Calculator className="h-4 w-4" /> Settlement
            </Link>

            {isOrg && (
              <Link
                href={`/groups/${group.id}/donations`}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-500 flex items-center gap-2"
              >
                <DollarSign className="h-4 w-4" /> Contributions
              </Link>
            )}

            <Link
              href={
                isOrg
                  ? `/groups/${group.id}/add-expense-org`
                  : `/groups/${group.id}/add-expense`
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Expense
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

//
// TransactionsList — DARK THEME
//
function TransactionsList({ group, departmentFilter, isOrg = false }: { group: Group; departmentFilter?: string; isOrg?: boolean }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredTransactions = ((): Transaction[] => {
    const txs = (group.transactions || []).filter(t => !t.isDeleted)
    if (!isOrg || departmentFilter === "all" || !departmentFilter) return txs

    return txs.filter(t => {
      if (t.department) return t.department === departmentFilter
      const uid = t.participants?.[0]?.userId
      if (!uid) return false
      const member = group.members.find(m => m.userId === uid)
      return member?.department === departmentFilter
    })
  })()

  const canDeleteTransaction = (transaction: Transaction) => {
    const userMember = group.members.find(m => m.userId === session?.user?.id)
    const isAdmin = userMember?.role === "ADMIN"
    const isCreator = transaction.addedBy?.id === session?.user?.id
    return Boolean(isAdmin || isCreator)
  }

  const handleDelete = async (transactionId: string) => {
    if (!confirm("Are you sure you want to delete this?")) return
    setDeletingId(transactionId)

    try {
      const res = await fetch(`/api/groups/${transactionId}/deleteTS`, { method: "DELETE" })
      if (res.ok) router.refresh()
      else alert("Failed to delete")
    } finally {
      setDeletingId(null)
    }
  }

  if (filteredTransactions.length === 0) {
    return (
      <div className="text-center py-16 bg-zinc-950 border border-zinc-800 rounded-2xl">
        <DollarSign className="mx-auto h-12 w-12 text-gray-600" />
        <h3 className="text-lg text-gray-300 mt-4">No {isOrg ? "expenses" : "transactions"} yet</h3>
        <Link
          href={`/groups/${group.id}/add-expense`}
          className="mt-6 inline-flex items-center px-6 py-2 bg-blue-600 rounded-xl hover:bg-blue-500 text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Expense
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {filteredTransactions.map((t) => (
        <div
          key={t.id}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-all"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-white font-medium">{t.description}</h4>
              <p className="text-gray-500 text-sm">Added by {t.addedBy?.name ?? "Unknown"}</p>
              <p className="text-xs text-gray-600">{new Date(t.date).toLocaleDateString()}</p>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-lg text-white font-semibold">
                {formatCurrency(toNumber(t.amount))}
              </p>

              {canDeleteTransaction(t) && (
                <button
                  onClick={() => handleDelete(t.id)}
                  disabled={deletingId === t.id}
                  className={`p-2 rounded-lg border border-zinc-700 text-gray-400 hover:text-red-500 hover:border-red-600 ${
                    deletingId === t.id && "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

//
// FriendsGroupUI — DARK THEME
//
function FriendsGroupUI({ group, session, userMember, totalSpent, totalMembers }: {
  group: Group; session: any; userMember: GroupMember | undefined; totalSpent: number; totalMembers: number
}) {
  const [activeTab, setActiveTab] = useState<"transactions" | "members" | "analytics">("transactions")

  const tabs = [
    { id: "transactions", label: "Transactions", icon: DollarSign },
    { id: "members", label: "Members", icon: Users },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ] as const

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <GroupHeader group={group} userMember={userMember} />

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard title="Total Spent" value={formatCurrency(totalSpent)} icon={DollarSign} />
          <StatCard title="Members" value={totalMembers} icon={Users} />
          <StatCard
            title="Your Balance"
            value={
              userMember?.balance
                ? `${formatCurrency(Math.abs(toNumber(userMember.balance)))}
                   ${toNumber(userMember.balance) < 0 ? "owed" : ""}`
                : formatCurrency(0)
            }
            icon={TrendingUp}
            color={toNumber(userMember?.balance) < 0 ? "red-600" : "green-600"}
          />
          <StatCard title="Transactions" value={group.transactions.length} icon={DollarSign} />
        </div>

        {/* Tabs */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl">
          <div className="border-b border-zinc-800 px-6">
            <nav className="flex gap-8">{tabs.map((tab) => (
              <Tab key={tab.id} {...tab} activeTab={activeTab} setActiveTab={setActiveTab} />
            ))}</nav>
          </div>

          <div className="p-6">
            {activeTab === "transactions" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                <TransactionsList group={group} />
              </div>
            )}

            {activeTab === "members" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Group Members</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.members.map((member) => (
                    <div
                      key={member.id}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-white">{member.user.name}</h4>
                          <p className="text-gray-500 text-sm">
                            {member.role === "ADMIN" ? "Admin" : "Member"}
                          </p>
                        </div>

                        <p
                          className={`text-sm font-medium ${
                            toNumber(member.balance) >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {formatCurrency(Math.abs(toNumber(member.balance)))}
                          {toNumber(member.balance) < 0 && " owed"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Analytics</h3>
                <Link
                  href={`/groups/${group.id}/analytics`}
                  className="px-4 py-2 bg-blue-600 rounded-xl hover:bg-blue-500 text-white inline-flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4" /> View Full Analytics
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

//
// OrganizationGroupUI — DARK THEME
//
function OrganizationGroupUI({ group, session, userMember, totalSpent, totalMembers, totalCollected, remainingBalance }: {
  group: Group; session: any; userMember: GroupMember | undefined; totalSpent: number; totalMembers: number;
  totalCollected: number; remainingBalance: number;
}) {
  const [activeTab, setActiveTab] = useState<"transactions" | "members" | "departments" | "analytics">("transactions")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")

  const departments =
    group.departments?.length
      ? group.departments
      : Array.from(new Set(group.members.map((m) => m.department).filter(Boolean)))

  const tabs = [
    { id: "transactions", label: "Transactions", icon: DollarSign },
    { id: "members", label: "Members", icon: Users },
    { id: "departments", label: "Departments", icon: Building },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ] as const

  const deptSpending = useMemo(() => {
    const map: Record<string, number> = {}
    const txs = group.transactions.filter(t => !t.isDeleted)

    txs.forEach((t) => {
      const amount = toNumber(t.amount)
      const dept =
        t.department ??
        group.members.find((m) => m.userId === t.participants?.[0]?.userId)?.department ??
        "Unassigned"

      map[dept] = (map[dept] || 0) + amount
    })

    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [group.transactions, group.members])

  const PIE_COLORS = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#F97316"]

  const monthlySpend = useMemo(() => {
    const now = new Date()
    const months: { label: string; year: number; monthIndex: number; total: number }[] = []

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        label: d.toLocaleString("default", { month: "short" }),
        year: d.getFullYear(),
        monthIndex: d.getMonth(),
        total: 0,
      })
    }

    group.transactions
      .filter((t) => !t.isDeleted)
      .forEach((t) => {
        const dt = new Date(t.date)
        const amount = toNumber(t.amount)

        const monthEntry = months.find(
          (m) => m.year === dt.getFullYear() && m.monthIndex === dt.getMonth()
        )

        if (monthEntry) monthEntry.total += amount
      })

    return months.map((m) => ({ name: m.label, value: Math.round(m.total * 100) / 100 }))
  }, [group.transactions])

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <GroupHeader group={group} userMember={userMember} isOrg />

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Stats group={group} totalSpent={totalSpent} departmentsCount={departments.length} />
        </div>

        {/* Card Wrapper */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl mb-8">
          <div className="border-b border-zinc-800 px-6">
            <nav className="flex gap-8">{tabs.map((tab) => (
              <Tab key={tab.id} {...tab} activeTab={activeTab} setActiveTab={setActiveTab} />
            ))}</nav>
          </div>

          <div className="p-6">

            {activeTab === "transactions" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Recent Expenses</h3>

                  <div className="flex items-center gap-3">
                    <Filter className="h-5 w-5 text-blue-400" />

                    <select
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 text-gray-300 px-3 py-2 rounded-xl"
                    >
                      <option value="all">All Departments</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <TransactionsList group={group} departmentFilter={departmentFilter} isOrg />
              </div>
            )}

            {activeTab === "members" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Employees</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.members.map((member) => (
                    <div
                      key={member.id}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-white text-base">{member.user.name}</h4>
                          <p className="text-gray-500 text-sm">
                            {member.role === "ADMIN" ? "Admin" : "Employee"}
                            {member.department && ` • ${member.department}`}
                          </p>
                        </div>

                        <p
                          className={`text-base font-semibold ${
                            toNumber(member.balance) >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {formatCurrency(Math.abs(toNumber(member.balance)))}
                          {toNumber(member.balance) < 0 && " owed"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "departments" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Departments</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                  {departments.map((dept) => {
                    const deptMembers = group.members.filter((m) => m.department === dept)
                    const deptBalance = deptMembers.reduce((s, m) => s + toNumber(m.balance), 0)

                    const deptSpent = group.transactions
                      .filter((t) => !t.isDeleted)
                      .filter((t) =>
                        t.department
                          ? t.department === dept
                          : group.members.find((m) => m.userId === t.participants?.[0]?.userId)?.department === dept
                      )
                      .reduce((s, t) => s + toNumber(t.amount), 0)

                    return (
                      <div
                        key={dept}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-white text-base">{dept}</h4>
                            <p className="text-gray-500 text-sm">{deptMembers.length} employees</p>
                            <p className="text-gray-400 text-sm mt-1">
                              Dept Spent: {formatCurrency(deptSpent)}
                            </p>
                          </div>

                          <p
                            className={`text-base font-semibold ${
                              deptBalance >= 0 ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {formatCurrency(Math.abs(deptBalance))}
                            {deptBalance < 0 && " owed"}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Organizational Analytics</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Pie Chart */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <h4 className="text-white font-medium mb-3">Department Spend Breakdown</h4>

                    {deptSpending.length === 0 ? (
                      <p className="text-gray-500">No spending data yet.</p>
                    ) : (
                      <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                          <Pie
                            dataKey="value"
                            data={deptSpending}
                            nameKey="name"
                            outerRadius={80}
                            label
                          >
                            {deptSpending.map((_, idx) => (
                              <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <ReTooltip formatter={(v: any) => formatCurrency(toNumber(v))} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Line Chart */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <h4 className="text-white font-medium mb-3">Monthly Spend (last 6 months)</h4>

                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={monthlySpend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis tickFormatter={(v) => formatCurrency(toNumber(v))} stroke="#888" />
                        <ReTooltip formatter={(v: any) => formatCurrency(toNumber(v))} />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={2} dot />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}

//
// Main Component — Now Dark Themed
//
export default function GroupDetail() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const groupId = params?.id as string

  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin")
  }, [status])

  useEffect(() => {
    if (session?.user && groupId) {
      const load = async () => {
        try {
          const res = await fetch(`/api/groups/${groupId}`)
          if (!res.ok) return router.push("/dashboard")

          const data = await res.json()
          setGroup(data.group)
        } catch {
          router.push("/dashboard")
        } finally {
          setLoading(false)
        }
      }
      load()
    }
  }, [session, groupId])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full mx-auto" />
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || !group) return null

  const userMember =
    group.members.find((m) => m.userId === session.user?.id) ??
    group.members.find((m) => m.user.name === session.user?.name)

  const totalSpent = group.transactions.filter((t) => !t.isDeleted).reduce((s, t) => s + toNumber(t.amount), 0)
  const totalMembers = group.members.length

  const totalInitial = group.initialFunds?.reduce((s, x) => s + toNumber(x.amount), 0) ?? 0
  const totalDonations = group.donations?.reduce((s, x) => s + toNumber(x.amount), 0) ?? 0
  const totalCollected = totalInitial + totalDonations
  const remainingBalance = totalCollected - totalSpent

  return group.type === "FRIENDS" ? (
    <FriendsGroupUI
      group={group}
      session={session}
      userMember={userMember}
      totalSpent={totalSpent}
      totalMembers={totalMembers}
    />
  ) : (
    <OrganizationGroupUI
      group={group}
      session={session}
      userMember={userMember}
      totalSpent={totalSpent}
      totalMembers={totalMembers}
      totalCollected={totalCollected}
      remainingBalance={remainingBalance}
    />
  )
}
