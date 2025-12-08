
// "use client"

// import { useSession } from "next-auth/react"
// import { useRouter } from "next/navigation"
// import { useEffect, useState } from "react"
// import Link from "next/link"
// import { Plus, Users, DollarSign, TrendingUp, LogOut } from "lucide-react"
// import LogoutButton from "@/components/logout-button"
// import NotificationBell from "@/components/notification-bell"
// import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
// import toast, { Toaster } from "react-hot-toast"
// import ChatBot from "@/components/chat"
// interface Group {
//   id: string
//   name: string
//   type: "FRIENDS" | "ORGANIZATION"
//   code: string
//   balance: number
//   role: "ADMIN" | "MEMBER"
//   department?: string | null
//   members: { 
//     id: string
//     role: "ADMIN" | "MEMBER"
//     user: { 
//       id: string
//       name: string 
//     } 
//   }[]
//   _count: {
//     transactions: number
//   }
// }

// export default function Dashboard() {
//   const { data: session, status } = useSession()
//   const router = useRouter()
//   const [groups, setGroups] = useState<Group[]>([])
//   const [loading, setLoading] = useState(true)
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/auth/signin")
//     }
//   }, [status, router])

//   useEffect(() => {
//     if (session?.user?.id) {
//       fetchGroups()
//     }
//   }, [session])

//   const fetchGroups = async () => {
//     try {
//       const response = await fetch("/api/groups")
//       if (response.ok) {
//         const data = await response.json()
//         setGroups(data.groups || [])
//       }
//     } catch (error) {
//       console.error("Error fetching groups:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleLeaveGroup = async () => {
//     if (!selectedGroup) return

//     try {
//       const res = await fetch(`/api/groups/${selectedGroup.id}/leave`, {
//         method: "POST",
//       })

//       if (res.ok) {
//         toast.success(`You have left "${selectedGroup.name}"`, {
//           position: "bottom-center",
//           duration: 4000,
//         })
//         setGroups((prev) => prev.filter((g) => g.id !== selectedGroup.id))
//       } else {
//         const data = await res.json()
//         toast.error(data.error || "Failed to leave group", {
//           position: "bottom-center",
//           duration: 4000,
//         })
//       }
//     } catch (err) {
//       console.error(err)
//       toast.error("Something went wrong", {
//         position: "bottom-center",
//         duration: 4000,
//       })
//     } finally {
//       setIsModalOpen(false)
//       setSelectedGroup(null)
//     }
//   }

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

//   if (!session) {
//     return null
//   }


//   const totalBalance = groups.reduce((sum, group) => sum + Number(group.balance), 0)

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Toaster for notifications */}
//       <Toaster />

//       {/* Header */}
//       <header className="bg-emerald-500 shadow">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//               <p className="mt-1 text-sm text-gray-600">
//                 Welcome back, {session.user?.name}
//               </p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <NotificationBell />
//               <div className="flex items-center space-x-3">
//                 <Link
//                   href="/groups/create"
//                   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Create Group
//                 </Link>
//                 <LogoutButton variant="icon" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Stats */}
//         <div className="bg-green-200 grid p-1 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 mb-8 border-2 border-black">
//           <div className="bg-white overflow-hidden shadow rounded-lg border-2 border-blue-600">
//             <div className="p-5">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0">
//                   <Users className="h-6 w-6 text-gray-400" />
//                 </div>
//                 <div className="ml-5 w-0 flex-1">
//                   <dl>
//                     <dt className="text-sm font-medium text-gray-500 truncate">
//                       Total Groups
//                     </dt>
//                     <dd className="text-lg font-medium text-gray-900">
//                       {groups.length}
//                     </dd>
//                   </dl>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white overflow-hidden shadow rounded-lg border-blue-600 border-2">
//             <div className="p-5">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0">
//                   <DollarSign className="h-6 w-6 text-gray-400" />
//                 </div>
//                 <div className="ml-5 w-0 flex-1">
//                   <dl>
//                     <dt className="text-sm font-medium text-gray-500 truncate">
//                       Total Balance
//                     </dt>
//                     <dd className={`text-lg font-medium ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                       ${Math.abs(totalBalance).toFixed(2)}
//                       {totalBalance < 0 && " (owed)"}
//                     </dd>
//                   </dl>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white overflow-hidden shadow rounded-lg border-blue-600 border-2">
//             <div className="p-5">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0">
//                   <TrendingUp className="h-6 w-6 text-gray-400" />
//                 </div>
//                 <div className="ml-5 w-0 flex-1">
//                   <dl>
//                     <dt className="text-sm font-medium text-gray-500 truncate">
//                       Active Groups
//                     </dt>
//                     <dd className="text-lg font-medium text-gray-900">
//                       {groups.filter(g => g._count.transactions > 0).length}
//                     </dd>
//                   </dl>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white overflow-hidden shadow rounded-lg border-blue-600 border-2">
//             <div className="p-5">
//               <div className="flex items-center">
//                 <div className="flex-shrink-0">
//                   <Users className="h-6 w-6 text-gray-400" />
//                 </div>
//                 <div className="ml-5 w-0 flex-1">
//                   <dl>
//                     <dt className="text-sm font-medium text-gray-500 truncate">
//                       Total Members
//                     </dt>
//                     <dd className="text-lg font-medium text-gray-900">
//                       {groups.reduce((sum, group) => sum + group.members.length, 0)}
//                     </dd>
//                   </dl>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Join Group Section */}
//         <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 shadow rounded-lg border border-green-200">
//           <div className="px-4 py-5 sm:p-6 border-2 border-green-400 rounded-2xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
//                   Join a Group
//                 </h3>
//                 <p className="text-sm text-gray-600">
//                   Have a group code? Join an existing group to start tracking expenses together.
//                 </p>
//               </div>
//               <Link
//                 href="/groups/join"
//                 className="inline-flex items-center px-6 py-3 border-2 border-amber-400 text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Join with Code
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Groups */}
//         <div className="bg-white shadow rounded-lg">
//           <div className="px-4 py-5 sm:p-6">
//             <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
//               Your Groups
//             </h3>
            
//             {groups.length === 0 ? (
//               <div className="text-center py-12">
//                 <Users className="mx-auto h-12 w-12 text-gray-400" />
//                 <h3 className="mt-2 text-sm font-medium text-gray-900">No groups yet</h3>
//                 <p className="mt-1 text-sm text-gray-500">
//                   Get started by creating a new group or joining an existing one.
//                 </p>
//                 <div className="mt-6 flex justify-center space-x-4">
//                   <Link
//                     href="/groups/create"
//                     className="inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   >
//                     <Plus className="h-4 w-4 mr-2" />
//                     Create Your First Group
//                   </Link>
//                   <Link
//                     href="/groups/join"
//                     className="inline-flex items-center px-4 py-2 border-3 border-green-500 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   >
//                     Join a Group
//                   </Link>
//                 </div>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//                 {groups.map((group) => (
//                   <Link
//                     key={group.id}
//                     href={`/groups/${group.id}`}
//                     className="relative group bg-gradient-to-b from-white to-gray-50 p-6 rounded-2xl border-2 border-gray-500 hover:border-blue-400 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
//                   >
//                     {/* Header Section */}
//                     <div className="flex justify-between items-start">
//                       <span
//                         className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold ${
//                           group.type === "FRIENDS"
//                             ? "bg-blue-500 text-blue-800"
//                             : "bg-green-500 text-green-800"
//                         }`}
//                       >
//                         {group.type === "FRIENDS" ? "Friends" : "Organization"}
//                       </span>

//                       {group.role === "ADMIN" && (
//                         <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
//                           Admin
//                         </span>
//                       )}
//                     </div>

//                     {/* Group Info */}
//                     <div className="mt-5">
//                       <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
//                         {group.name}
//                       </h3>

//                       <p className="mt-1 text-sm text-gray-500">
//                         Code:{" "}
//                         <span className="font-mono font-medium tracking-wide text-gray-800">
//                           {group.code}
//                         </span>
//                       </p>

//                       {group.type === "ORGANIZATION" && group.department && (
//                         <p className="mt-1 text-sm text-gray-500">
//                           Department:{" "}
//                           <span className="font-medium text-gray-800">
//                             {group.department}
//                           </span>
//                         </p>
//                       )}
//                     </div>

//                     {/* Stats Section */}
//                     <div className="mt-6 flex justify-between items-center">
//                       <div>
//                         <p className="text-xs text-gray-500">Members</p>
//                         <p className="text-lg font-semibold text-gray-900">
//                           {group.members.length}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-xs text-gray-500">Your Balance</p>
//                         <p
//                           className={`text-lg font-semibold ${
//                             Number(group.balance) >= 0
//                               ? "text-green-600"
//                               : "text-red-600"
//                           }`}
//                         >
//                           ${Math.abs(Number(group.balance)).toFixed(2)}
//                           {Number(group.balance) < 0 && " owed"}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Members Avatars */}
//                     <div className="mt-5 pt-4 border-t border-gray-200">
//                       <div className="flex items-center">
//                         <div className="flex -space-x-2">
//                           {group.members.slice(0, 3).map((member) => (
//                             <div
//                               key={member.id}
//                               className={`inline-flex items-center justify-center h-8 w-8 rounded-full text-xs font-semibold text-white shadow-sm ${
//                                 member.user.id === session.user?.id
//                                   ? "bg-blue-600 ring-2 ring-blue-300"
//                                   : member.role === "ADMIN"
//                                   ? "bg-purple-600"
//                                   : "bg-gray-600"
//                               }`}
//                               title={`${member.user.name}${
//                                 member.user.id === session.user?.id ? " (You)" : ""
//                               }${member.role === "ADMIN" ? " - Admin" : ""}`}
//                             >
//                               {member.user.name.charAt(0).toUpperCase()}
//                             </div>
//                           ))}
//                           {group.members.length > 3 && (
//                             <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-300 text-xs font-semibold text-gray-700">
//                               +{group.members.length - 3}
//                             </div>
//                           )}
//                         </div>
//                         <span className="ml-3 text-xs text-gray-500">
//                           {group.members.filter((m) => m.role === "ADMIN").length} admin
//                           {group.members.filter((m) => m.role === "ADMIN").length !== 1
//                             ? "s"
//                             : ""}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Leave Group Button */}
//                     <div className="mt-4 flex justify-end">
//                       <button
//                         type="button"
//                         onClick={(e) => {
//                           e.preventDefault() // Prevent navigation
//                           setSelectedGroup(group)
//                           setIsModalOpen(true)
//                         }}
//                         className="inline-flex items-center text-xs px-2 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
//                         aria-label={`Leave ${group.name} group`}
//                       >
//                         <LogOut className="h-4 w-4 mr-1" />
//                         Leave Group
//                       </button>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Modal for Confirming Leave Group */}
//         <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
//           <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
//           <div className="fixed inset-0 flex items-center justify-center p-4">
//             <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
//               <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
//                 Leave Group
//               </DialogTitle>
//               <p className="mt-2 text-sm text-gray-600">
//                 Are you sure you want to leave "{selectedGroup?.name}"? This action cannot be undone.
//               </p>
//               <div className="mt-6 flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleLeaveGroup}
//                   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                 >
//                   Confirm
//                 </button>
//               </div>
//             </DialogPanel>
//           </div>
//         </Dialog>
//       </main>

//        {/* <ChatBot groupId={group.id} userId={session.user?.id} /> */}
//     </div>
//   )
// }
//--------------------------------------------------------------

"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Users, DollarSign, TrendingUp, LogOut, Sparkles, ArrowRight, Activity, Shield, X, Search, Filter } from "lucide-react"
import LogoutButton from "@/components/logout-button"
import NotificationBell from "@/components/notification-bell"
import toast, { Toaster } from "react-hot-toast"
import ChatBot from "@/components/chat"

interface Group {
  id: string
  name: string
  type: "FRIENDS" | "ORGANIZATION"
  code: string
  balance: number
  role: "ADMIN" | "MEMBER"
  department?: string | null
  members: { 
    id: string
    role: "ADMIN" | "MEMBER"
    user: { 
      id: string
      name: string 
    } 
  }[]
  _count: {
    transactions: number
  }
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"ALL" | "FRIENDS" | "ORGANIZATION">("ALL")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchGroups()
    }
  }, [session])

  const fetchGroups = async () => {
    try {
      const response = await fetch("/api/groups")
      if (response.ok) {
        const data = await response.json()
        setGroups(data.groups || [])
      }
    } catch (error) {
      console.error("Error fetching groups:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLeaveGroup = async () => {
    if (!selectedGroup) return

    try {
      const res = await fetch(`/api/groups/${selectedGroup.id}/leave`, {
        method: "POST",
      })

      if (res.ok) {
        toast.success(`You have left "${selectedGroup.name}"`, {
          position: "bottom-center",
          duration: 4000,
        })
        setGroups((prev) => prev.filter((g) => g.id !== selectedGroup.id))
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to leave group", {
          position: "bottom-center",
          duration: 4000,
        })
      }
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong", {
        position: "bottom-center",
        duration: 4000,
      })
    } finally {
      setIsModalOpen(false)
      setSelectedGroup(null)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const totalBalance = groups.reduce((sum, group) => sum + Number(group.balance), 0)
  
  // Filter groups
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "ALL" || group.type === filterType
    return matchesSearch && matchesFilter
  })

  const youOwe = groups.reduce((sum, g) => sum + (Number(g.balance) < 0 ? Math.abs(Number(g.balance)) : 0), 0)
  const youAreOwed = groups.reduce((sum, g) => sum + (Number(g.balance) > 0 ? Number(g.balance) : 0), 0)

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster 
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#fff',
            border: '1px solid #27272a'
          },
        }}
      />

      {/* Sidebar + Main Layout */}
      <div className="flex h-screen">
        {/* Left Sidebar */}
        <aside className="w-80 border-r border-zinc-800 bg-zinc-950 flex flex-col">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Xpence Tracker</h1>
                <p className="text-xs text-gray-500">Track smarter, not harder</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-lg font-bold">
                {session.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{session.user?.name}</p>
                <p className="text-sm text-gray-500">{session.user?.email}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-900 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">You owe</p>
                <p className="text-lg font-bold text-red-400">₹{youOwe.toFixed(2)}</p>
              </div>
              <div className="bg-zinc-900 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">You're owed</p>
                <p className="text-lg font-bold text-green-400">₹{youAreOwed.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 space-y-3 flex-1">
            <Link
              href="/groups/create"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-medium hover:from-blue-500 hover:to-purple-500 transition-all"
            >
              <Plus className="w-4 h-4" />
              Create New Group
            </Link>
            <Link
              href="/groups/join"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 border border-zinc-800 rounded-xl font-medium hover:bg-zinc-800 transition-all"
            >
              <Users className="w-4 h-4 " />
              Join Group
            </Link>
          </div>

          {/* Bottom Actions */}
          <div className="p-6 border-t border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <NotificationBell />
              <LogoutButton variant="icon" />
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {/* Top Bar */}
          <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Your Groups</h2>
                <p className="text-gray-500 text-sm mt-1">{groups.length} total groups • {filteredGroups.length} showing</p>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType("ALL")}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    filterType === "ALL" 
                      ? "bg-blue-600 text-white" 
                      : "bg-zinc-900 text-gray-400 hover:text-white"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType("FRIENDS")}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    filterType === "FRIENDS" 
                      ? "bg-blue-600 text-white" 
                      : "bg-zinc-900 text-gray-400 hover:text-white"
                  }`}
                >
                  Friends
                </button>
                <button
                  onClick={() => setFilterType("ORGANIZATION")}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    filterType === "ORGANIZATION" 
                      ? "bg-green-600 text-white" 
                      : "bg-zinc-900 text-gray-400 hover:text-white"
                  }`}
                >
                  Organizations
                </button>
              </div>
            </div>
          </div>

          {/* Groups Grid */}
          <div className="p-6">
            {filteredGroups.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {searchTerm || filterType !== "ALL" ? "No groups found" : "No groups yet"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || filterType !== "ALL" 
                    ? "Try adjusting your search or filters" 
                    : "Create your first group to get started"}
                </p>
                {!searchTerm && filterType === "ALL" && (
                  <div className="flex justify-center gap-3">
                    <Link
                      href="/groups/create"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-medium hover:from-blue-500 hover:to-purple-500 transition-all"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Group
                    </Link>
                    <Link
                      href="/groups/join"
                      className="inline-flex items-center px-6 py-3 bg-green-500 border border-zinc-800 rounded-xl font-medium hover:bg-zinc-800 transition-all"
                    >
                      Join Group
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold">{group.name}</h3>
                          {group.role === "ADMIN" && (
                            <Shield className="w-4 h-4 text-purple-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-md ${
                            group.type === "FRIENDS"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-green-500/20 text-green-400"
                          }`}>
                            {group.type === "FRIENDS" ? "Friends" : "Organization"}
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500 font-mono">{group.code}</span>
                        </div>
                      </div>
                    </div>

                    {/* Balance - Prominent */}
                    <div className="mb-4 p-4 bg-zinc-950 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Your Balance</p>
                      <p className={`text-3xl font-bold ${
                        Number(group.balance) >= 0 ? "text-green-400" : "text-red-400"
                      }`}>
                        {Number(group.balance) >= 0 ? "+" : "-"}₹{Math.abs(Number(group.balance)).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {Number(group.balance) >= 0 
                          ? "You are owed" 
                          : "You owe"}
                      </p>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-zinc-800">
                      <div>
                        <p className="text-xs text-gray-500">Members</p>
                        <p className="text-sm font-semibold">{group.members.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Transactions</p>
                        <p className="text-sm font-semibold">{group._count.transactions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Admins</p>
                        <p className="text-sm font-semibold">
                          {group.members.filter(m => m.role === "ADMIN").length}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/groups/${group.id}`}
                        className="flex-1 text-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium hover:bg-blue-500 transition-all"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          setSelectedGroup(group)
                          setIsModalOpen(true)
                        }}
                        className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-medium hover:bg-red-600 hover:border-red-600 transition-all"
                      >
                        <LogOut className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Leave Group Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-2">Leave Group</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to leave "{selectedGroup?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl font-medium hover:bg-zinc-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLeaveGroup}
                className="px-4 py-2 bg-red-600 rounded-xl font-medium hover:bg-red-500 transition-all"
              >
                Confirm Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* <ChatBot groupId={group.id} userId={session.user?.id} /> */}
    </div>
  )
}