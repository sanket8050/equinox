// "use client"

// import { useSession } from "next-auth/react"
// import { useRouter } from "next/navigation"
// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { ArrowLeft, Users, Building } from "lucide-react"

// export default function CreateGroup() {
//   const { data: session, status } = useSession()
//   const router = useRouter()
//   const [formData, setFormData] = useState({
//     name: "",
//     type: "FRIENDS" as "FRIENDS" | "ORGANIZATION",
//     description: ""
//   })
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState("")

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/auth/signin")
//     }
//   }, [status, router])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setError("")

//     try {
//       const response = await fetch("/api/groups", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       })

//       if (response.ok) {
//         const data = await response.json()
//         router.push(`/groups/${data.group.id}`)
//       } else {
//         const errorData = await response.json()
//         setError(errorData.error || "Failed to create group")
//       }
//     } catch (error) {
//       setError("Something went wrong")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const handleTypeChange = (type: "FRIENDS" | "ORGANIZATION") => {
//     setFormData(prev => ({
//       ...prev,
//       type
//     }))
//   }

//   if (status === "loading") {
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

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-6">
//             <div className="flex items-center">
//               <Link
//                 href="/dashboard"
//                 className="mr-4 p-2 text-gray-400 hover:text-gray-500"
//               >
//                 <ArrowLeft className="h-5 w-5" />
//               </Link>
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900">Create Group</h1>
//                 <p className="mt-1 text-sm text-gray-500">
//                   Start managing expenses with friends or organization
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white shadow rounded-lg">
//           <div className="px-4 py-5 sm:p-6">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {error && (
//                 <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
//                   {error}
//                 </div>
//               )}

//               {/* Group Type Selection */}
//               <div>
//                 <label className="text-base font-medium text-gray-900">
//                   Group Type
//                 </label>
//                 <p className="text-sm text-gray-500">
//                   Choose the type of group you want to create
//                 </p>
//                 <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
//                   <div
//                     className={`relative rounded-lg p-4 border-2 cursor-pointer transition-colors ${
//                       formData.type === "FRIENDS"
//                         ? "border-blue-500 bg-blue-50"
//                         : "border-gray-200 hover:border-gray-300"
//                     }`}
//                     onClick={() => handleTypeChange("FRIENDS")}
//                   >
//                     <div className="flex items-center">
//                       <Users className={`h-6 w-6 ${
//                         formData.type === "FRIENDS" ? "text-blue-600" : "text-gray-400"
//                       }`} />
//                       <div className="ml-3">
//                         <h3 className={`text-sm font-medium ${
//                           formData.type === "FRIENDS" ? "text-blue-900" : "text-gray-900"
//                         }`}>
//                           Friends
//                         </h3>
//                         <p className={`text-sm ${
//                           formData.type === "FRIENDS" ? "text-blue-700" : "text-gray-500"
//                         }`}>
//                           Perfect for trips and casual outings
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div
//                     className={`relative rounded-lg p-4 border-2 cursor-pointer transition-colors ${
//                       formData.type === "ORGANIZATION"
//                         ? "border-green-500 bg-green-50"
//                         : "border-gray-200 hover:border-gray-300"
//                     }`}
//                     onClick={() => handleTypeChange("ORGANIZATION")}
//                   >
//                     <div className="flex items-center">
//                       <Building className={`h-6 w-6 ${
//                         formData.type === "ORGANIZATION" ? "text-green-600" : "text-gray-400"
//                       }`} />
//                       <div className="ml-3">
//                         <h3 className={`text-sm font-medium ${
//                           formData.type === "ORGANIZATION" ? "text-green-900" : "text-gray-900"
//                         }`}>
//                           Organization
//                         </h3>
//                         <p className={`text-sm ${
//                           formData.type === "ORGANIZATION" ? "text-green-700" : "text-gray-500"
//                         }`}>
//                           For events, campaigns, and teams
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Group Name */}
//               <div>
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                   Group Name
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   id="name"
//                   required
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-green-400 text-green-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="e.g., Summer Trip 2024, Office Team Lunch"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                 />
//               </div>

//               {/* Description */}
//               <div>
//                 <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//                   Description (Optional)
//                 </label>
//                 <textarea
//                   name="description"
//                   id="description"
//                   rows={3}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-green-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Brief description of your group..."
//                   value={formData.description}
//                   onChange={handleInputChange}
//                 />
//               </div>

//               {/* Submit Button */}
//               <div className="flex justify-end space-x-3">
//                 <Link
//                   href="/dashboard"
//                   className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
//                 >
//                   Cancel
//                 </Link> 
//                 <button
//                   type="submit"
//                   disabled={isLoading || !formData.name.trim()}
//                   className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//                 >
//                   {isLoading ? "Creating..." : "Create Group"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }
//----------------------------------------------------------------
"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Users, Building, Sparkles, Check, Zap, TrendingUp, Shield, Activity, Crown, ChevronDown } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

export default function CreateGroup() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    type: "FRIENDS" as "FRIENDS" | "ORGANIZATION",
    description: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showTips, setShowTips] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success("Group created successfully!", {
          position: "bottom-center",
          duration: 3000,
        })
        router.push(`/groups/${data.group.id}`)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to create group")
        toast.error(errorData.error || "Failed to create group", {
          position: "bottom-center",
          duration: 4000,
        })
      }
    } catch (error) {
      setError("Something went wrong")
      toast.error("Something went wrong", {
        position: "bottom-center",
        duration: 4000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTypeChange = (type: "FRIENDS" | "ORGANIZATION") => {
    setFormData(prev => ({
      ...prev,
      type
    }))
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

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

      {/* Animated Background - Hidden on small screens */}
      <div className="hidden md:block fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/dashboard"
              className="p-2 sm:p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 hover:border-zinc-700 transition-all"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Create Group</h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                  Start managing expenses with friends or organization
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Form - Full width on mobile, 2/3 on XL */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {/* Main Form Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-8 shadow-xl">
              <div className="space-y-6 sm:space-y-8">
                {/* Error Alert */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-3 py-2 sm:px-4 sm:py-3 rounded-xl animate-pulse text-sm">
                    {error}
                  </div>
                )}

                {/* Group Type Selection */}
                <div>
                  <label className="block text-base sm:text-lg font-bold mb-2 sm:mb-4">
                    Choose Group Type
                  </label>
                  <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                    Select the perfect type for your expense tracking needs
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* Friends Option */}
                    <div
                      className={`relative rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 cursor-pointer transition-all group ${
                        formData.type === "FRIENDS"
                          ? "border-blue-500 bg-gradient-to-br from-blue-500/10 to-purple-500/10 shadow-lg shadow-blue-500/20"
                          : "border-zinc-800 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-900"
                      }`}
                      onClick={() => handleTypeChange("FRIENDS")}
                    >
                      {/* Decorative Glow - Hidden on mobile */}
                      {formData.type === "FRIENDS" && (
                        <div className="hidden sm:block absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
                      )}
                      
                      <div className="relative">
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                          <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center transition-all ${
                            formData.type === "FRIENDS" 
                              ? "bg-blue-500/20 shadow-lg shadow-blue-500/30" 
                              : "bg-zinc-800 group-hover:bg-zinc-700"
                          }`}>
                            <Users className={`h-5 w-5 sm:h-7 sm:w-7 transition-colors ${
                              formData.type === "FRIENDS" ? "text-blue-400" : "text-gray-400 group-hover:text-gray-300"
                            }`} />
                          </div>
                          {formData.type === "FRIENDS" && (
                            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50 animate-in zoom-in duration-300">
                              <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                            </div>
                          )}
                        </div>
                        <h3 className={`text-base sm:text-xl font-bold mb-1 sm:mb-2 transition-colors ${
                          formData.type === "FRIENDS" ? "text-blue-400" : "text-white"
                        }`}>
                          Friends
                        </h3>
                        <p className={`text-xs sm:text-sm leading-relaxed transition-colors ${
                          formData.type === "FRIENDS" ? "text-gray-300" : "text-gray-500"
                        }`}>
                          Perfect for trips, dinners, and casual outings
                        </p>
                        
                        {/* Features List - Simplified on mobile */}
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-zinc-800 space-y-1.5 sm:space-y-2">
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-blue-400"></div>
                            <span>Easy expense splitting</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-blue-400"></div>
                            <span>Quick settlements</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Organization Option */}
                    <div
                      className={`relative rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 cursor-pointer transition-all group ${
                        formData.type === "ORGANIZATION"
                          ? "border-green-500 bg-gradient-to-br from-green-500/10 to-emerald-500/10 shadow-lg shadow-green-500/20"
                          : "border-zinc-800 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-900"
                      }`}
                      onClick={() => handleTypeChange("ORGANIZATION")}
                    >
                      {/* Decorative Glow - Hidden on mobile */}
                      {formData.type === "ORGANIZATION" && (
                        <div className="hidden sm:block absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl"></div>
                      )}
                      
                      <div className="relative">
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                          <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center transition-all ${
                            formData.type === "ORGANIZATION" 
                              ? "bg-green-500/20 shadow-lg shadow-green-500/30" 
                              : "bg-zinc-800 group-hover:bg-zinc-700"
                          }`}>
                            <Building className={`h-5 w-5 sm:h-7 sm:w-7 transition-colors ${
                              formData.type === "ORGANIZATION" ? "text-green-400" : "text-gray-400 group-hover:text-gray-300"
                            }`} />
                          </div>
                          {formData.type === "ORGANIZATION" && (
                            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50 animate-in zoom-in duration-300">
                              <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                            </div>
                          )}
                        </div>
                        <h3 className={`text-base sm:text-xl font-bold mb-1 sm:mb-2 transition-colors ${
                          formData.type === "ORGANIZATION" ? "text-green-400" : "text-white"
                        }`}>
                          Organization
                        </h3>
                        <p className={`text-xs sm:text-sm leading-relaxed transition-colors ${
                          formData.type === "ORGANIZATION" ? "text-gray-300" : "text-gray-500"
                        }`}>
                          Ideal for events, campaigns, and teams
                        </p>

                        {/* Features List - Simplified on mobile */}
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-zinc-800 space-y-1.5 sm:space-y-2">
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-400"></div>
                            <span>Department tracking</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-400"></div>
                            <span>Advanced reporting</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Group Name */}
                <div>
                  <label htmlFor="name" className="block text-base sm:text-lg font-bold mb-2 sm:mb-3">
                    Group Name *
                  </label>
                  <div className="relative group">
                    <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity"></div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className="relative w-full bg-zinc-950 border-2 border-zinc-800 rounded-xl px-4 py-3 sm:px-5 sm:py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all text-sm sm:text-lg"
                      placeholder="e.g., Summer Trip 2024"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <p className="mt-2 sm:mt-3 text-xs text-gray-500">
                    Choose a memorable name that everyone will recognize
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-base sm:text-lg font-bold mb-2 sm:mb-3">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-xl px-4 py-3 sm:px-5 sm:py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all resize-none text-sm sm:text-base"
                    placeholder="Add details about your group..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                  <p className="mt-2 sm:mt-3 text-xs text-gray-500">
                    Help members understand the group's purpose
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6 border-t border-zinc-800">
                  <Link
                    href="/dashboard"
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-zinc-800 border border-zinc-700 rounded-xl font-medium hover:bg-zinc-700 transition-all text-center text-sm sm:text-base"
                  >
                    Cancel
                  </Link>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !formData.name.trim()}
                    className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 text-sm sm:text-base"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                        Create Group
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Tips Section - Collapsible */}
            <div className="xl:hidden">
              <button
                onClick={() => setShowTips(!showTips)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between hover:border-zinc-700 transition-all"
              >
                <span className="font-bold text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Helpful Information
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showTips ? 'rotate-180' : ''}`} />
              </button>
              
              {showTips && (
                <div className="mt-4 space-y-4 animate-in slide-in-from-top-2">
                  {/* What Happens Next - Mobile */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      What Happens Next
                    </h3>
                    <div className="space-y-2 text-xs text-gray-400">
                      <p>🔑 Get a unique 6-character group code</p>
                      <p>👑 You become the group admin</p>
                      <p>📤 Share code with members to join</p>
                      <p>💰 Start tracking expenses together</p>
                    </div>
                  </div>

                  {/* Quick Tips - Mobile */}
                  <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-4">
                    <h3 className="font-bold mb-2 text-xs text-blue-400 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      Quick Tips
                    </h3>
                    <ul className="space-y-1.5 text-xs text-gray-400">
                      <li>• Use clear, descriptive names</li>
                      <li>• Add a helpful description</li>
                      <li>• Share the code immediately</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Hidden on mobile, visible on XL */}
          <div className="hidden xl:block space-y-6">
            {/* What Happens Next */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                What Happens Next
              </h3>
              <div className="space-y-4">
                {[
                  { step: "1", text: "Get a unique 6-character code", icon: "🔑" },
                  { step: "2", text: "You become the group admin", icon: "👑" },
                  { step: "3", text: "Share code with members", icon: "📤" },
                  { step: "4", text: "Start tracking expenses", icon: "💰" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-zinc-800 group-hover:bg-purple-500/20 text-gray-400 group-hover:text-purple-400 text-sm font-bold transition-all">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1 pt-1.5">
                      <p className="text-sm text-gray-300">
                        <span className="mr-2 text-base">{item.icon}</span>
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Benefits */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <h3 className="font-bold mb-4 text-sm text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-400" />
                Admin Benefits
              </h3>
              <div className="space-y-3">
                {[
                  { icon: Shield, text: "Full group control", color: "text-blue-400" },
                  { icon: Users, text: "Manage all members", color: "text-green-400" },
                  { icon: TrendingUp, text: "View analytics", color: "text-purple-400" },
                  { icon: Activity, text: "Edit transactions", color: "text-yellow-400" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition-all">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <span className="text-sm text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6">
              <h3 className="font-bold mb-3 text-sm text-blue-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Quick Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Use clear, descriptive names</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Add a helpful description</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Share the code immediately</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}