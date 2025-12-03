// "use client"

// import { useSession } from "next-auth/react"
// import { useRouter } from "next/navigation"
// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { ArrowLeft, Users, CheckCircle, XCircle } from "lucide-react"

// export default function JoinGroup() {
//   const { data: session, status } = useSession()
//   const router = useRouter()
//   const [groupCode, setGroupCode] = useState("")
//   const [department, setDepartment] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [isFetchingGroup, setIsFetchingGroup] = useState(false)
//   const [error, setError] = useState("")
//   const [success, setSuccess] = useState("")
//   const [groupInfo, setGroupInfo] = useState<any>(null)

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/auth/signin")
//     }
//   }, [status, router])

//   // Fetch group info when code is complete (6 characters)
//   const fetchGroupInfo = async (code: string) => {
//     if (code.length !== 6) {
//       setGroupInfo(null)
//       return
//     }

//     setIsFetchingGroup(true)
//     setError("")

//     try {
//       const response = await fetch(`/api/groups/info?code=${code.toUpperCase()}`)

//       if (response.ok) {
//         const data = await response.json()
//         setGroupInfo(data.group)
//       } else {
//         const errorData = await response.json()
//         setError(errorData.error || "Group not found")
//         setGroupInfo(null)
//       }
//     } catch (error) {
//       console.error(error)
//       setError("Failed to fetch group information")
//       setGroupInfo(null)
//     } finally {
//       setIsFetchingGroup(false)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setError("")
//     setSuccess("")

//     if (!groupCode.trim()) {
//       setError("Please enter a group code")
//       setIsLoading(false)
//       return
//     }

//     // Validate department for ORGANIZATION groups
//     if (groupInfo?.type === "ORGANIZATION" && !department.trim()) {
//       setError("Department is required for organization groups")
//       setIsLoading(false)
//       return
//     }

//     try {
//       const response = await fetch(`/api/groups/join`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           code: groupCode.toUpperCase(),
//           department: groupInfo?.type === "ORGANIZATION" ? department.trim() : null,
//         }),
//       })

//       if (response.ok) {
//         const data = await response.json()
//         setSuccess("Successfully joined the group!")
//         setTimeout(() => {
//           router.push(`/groups/${data.group.id}`)
//         }, 1500)
//       } else {
//         const errorData = await response.json()
//         setError(errorData.error || "Failed to join group")
//       }
//     } catch (error) {
//       console.error(error)
//       setError("Something went wrong. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value.toUpperCase().slice(0, 6)
//     setGroupCode(value)
//     setError("")
//     setSuccess("")
//     setDepartment("") // Clear department when code changes

//     // Fetch group info when code reaches 6 characters
//     if (value.length === 6) {
//       fetchGroupInfo(value)
//     } else {
//       setGroupInfo(null)
//     }
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

//   if (!session) return null

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
//                 <h1 className="text-3xl font-bold text-gray-900">Join Group</h1>
//                 <p className="mt-1 text-sm text-gray-500">
//                   Enter a group code to join an existing group
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Form */}
//       <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white shadow rounded-lg">
//           <div className="px-4 py-5 sm:p-6">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Error Message */}
//               {error && (
//                 <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center">
//                   <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
//                   {error}
//                 </div>
//               )}

//               {/* Success Message */}
//               {success && (
//                 <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md flex items-center">
//                   <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
//                   {success}
//                 </div>
//               )}

//               {/* Group Code Input */}
//               <div>
//                 <label
//                   htmlFor="groupCode"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Group Code
//                 </label>
//                 <input
//                   type="text"
//                   id="groupCode"
//                   required
//                   maxLength={6}
//                   className="mt-1 block w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-2xl font-mono tracking-widest uppercase"
//                   placeholder="ABC123"
//                   value={groupCode}
//                   onChange={handleCodeChange}
//                   disabled={isLoading}
//                 />
//                 <p className="mt-2 text-sm text-gray-500">
//                   Ask a group admin for the 6-character group code
//                 </p>
//               </div>

//               {/* Loading indicator while fetching group */}
//               {isFetchingGroup && (
//                 <div className="flex items-center justify-center py-4">
//                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//                   <span className="ml-2 text-sm text-gray-600">Loading group info...</span>
//                 </div>
//               )}

//               {/* Group Info Preview */}
//               {groupInfo && !isFetchingGroup && (
//                 <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
//                   <div className="flex items-start">
//                     <Users className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
//                     <div className="flex-1">
//                       <h3 className="text-sm font-medium text-blue-900">
//                         {groupInfo.name}
//                       </h3>
//                       <p className="text-sm text-blue-700 mt-1">
//                         {groupInfo.type === "FRIENDS"
//                           ? "Friends Group"
//                           : "Organization Group"}{" "}
//                         • {groupInfo.memberCount || 0} member{groupInfo.memberCount !== 1 ? 's' : ''}
//                       </p>
//                       {groupInfo.type === "ORGANIZATION" && (
//                         <p className="text-xs text-blue-600 mt-2">
//                           📋 Department information required
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Department Input (only for Organization) */}
//               {groupInfo?.type === "ORGANIZATION" && !isFetchingGroup && (
//                 <div>
//                   <label
//                     htmlFor="department"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Department <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="department"
//                     required
//                     className="mt-1 block w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="e.g., Marketing, Engineering, Finance"
//                     value={department}
//                     onChange={(e) => setDepartment(e.target.value)}
//                     disabled={isLoading}
//                   />
//                   <p className="mt-2 text-sm text-gray-500">
//                     Specify your department within the organization
//                   </p>
//                 </div>
//               )}

//               {/* Submit Button */}
//               <div className="flex justify-end space-x-3">
//                 <Link
//                   href="/dashboard"
//                   className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Cancel
//                 </Link>
//                 <button
//                   type="submit"
//                   disabled={
//                     isLoading ||
//                     isFetchingGroup ||
//                     !groupInfo ||
//                     (groupInfo?.type === "ORGANIZATION" && !department.trim())
//                   }
//                   className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isLoading ? "Joining..." : "Join Group"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>

//         {/* Help Section */}
//         <div className="mt-8 bg-white shadow rounded-lg">
//           <div className="px-4 py-5 sm:p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">
//               Need Help?
//             </h3>
//             <div className="space-y-3">
//               {[
//                 "Ask a group admin for the 6-character group code",
//                 "Enter the code above - group details will appear automatically",
//                 "For organization groups, enter your department",
//                 "Click 'Join Group' to complete the process",
//               ].map((text, i) => (
//                 <div key={i} className="flex items-start">
//                   <div className="flex-shrink-0">
//                     <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
//                       {i + 1}
//                     </div>
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-sm text-gray-700">{text}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

//-------------------------------------------------------------------------------

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  CheckCircle,
  XCircle,
  Building,
  Sparkles,
  Shield,
  Hash,
  TrendingUp,
  Activity,
  Zap,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function JoinGroup() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [groupCode, setGroupCode] = useState("");
  const [department, setDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingGroup, setIsFetchingGroup] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [groupInfo, setGroupInfo] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Fetch group info when code is complete (6 characters)
  const fetchGroupInfo = async (code: string) => {
    if (code.length !== 6) {
      setGroupInfo(null);
      return;
    }

    setIsFetchingGroup(true);
    setError("");

    try {
      const response = await fetch(
        `/api/groups/info?code=${code.toUpperCase()}`
      );

      if (response.ok) {
        const data = await response.json();
        setGroupInfo(data.group);
        toast.success("Group found!", {
          position: "bottom-center",
          duration: 2000,
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Group not found");
        setGroupInfo(null);
        toast.error(errorData.error || "Group not found", {
          position: "bottom-center",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      setError("Failed to fetch group information");
      setGroupInfo(null);
      toast.error("Failed to fetch group information", {
        position: "bottom-center",
        duration: 3000,
      });
    } finally {
      setIsFetchingGroup(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!groupCode.trim()) {
      setError("Please enter a group code");
      toast.error("Please enter a group code", {
        position: "bottom-center",
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }

    // Validate department for ORGANIZATION groups
    if (groupInfo?.type === "ORGANIZATION" && !department.trim()) {
      setError("Department is required for organization groups");
      toast.error("Department is required for organization groups", {
        position: "bottom-center",
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/groups/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: groupCode.toUpperCase(),
          department:
            groupInfo?.type === "ORGANIZATION" ? department.trim() : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess("Successfully joined the group!");
        toast.success("Successfully joined the group!", {
          position: "bottom-center",
          duration: 3000,
        });
        setTimeout(() => {
          router.push(`/groups/${data.group.id}`);
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to join group");
        toast.error(errorData.error || "Failed to join group", {
          position: "bottom-center",
          duration: 4000,
        });
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.", {
        position: "bottom-center",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 6);
    setGroupCode(value);
    setError("");
    setSuccess("");
    setDepartment(""); // Clear department when code changes

    // Fetch group info when code reaches 6 characters
    if (value.length === 6) {
      fetchGroupInfo(value);
    } else {
      setGroupInfo(null);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-green-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster
        toastOptions={{
          style: {
            background: "#18181b",
            color: "#fff",
            border: "1px solid #27272a",
          },
        }}
      />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 hover:border-zinc-700 transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Join Group</h1>
                <p className="text-sm text-gray-500">
                  Enter a group code to join an existing group
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-5xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Form Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
              <div className="space-y-8">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 animate-pulse">
                    <XCircle className="h-5 w-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-xl flex items-center gap-3 animate-pulse">
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                {/* Group Code Input */}
                <div>
                  <label
                    htmlFor="groupCode"
                    className="block text-lg font-bold mb-4"
                  >
                    Enter Group Code
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    <div className="relative bg-zinc-950 border-2 border-zinc-800 rounded-2xl overflow-hidden focus-within:border-green-500 transition-all">
                      <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
                        <Hash className="w-7 h-7 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        id="groupCode"
                        required
                        maxLength={6}
                        className="w-full bg-transparent pl-16 pr-6 py-6 text-white placeholder-gray-600 focus:outline-none text-center text-4xl font-mono tracking-[0.6em] uppercase font-bold"
                        placeholder="ABC123"
                        value={groupCode}
                        onChange={handleCodeChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Sparkles className="w-4 h-4" />
                    <span>Ask a group admin for the 6-character code</span>
                  </div>

                  {/* Code Progress Indicator */}
                  <div className="mt-4 flex justify-center gap-2">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i < groupCode.length
                            ? "bg-green-500 w-3 h-3"
                            : "bg-zinc-800"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Loading indicator while fetching group */}
                {isFetchingGroup && (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 border-4 border-green-500/20 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <span className="text-gray-400 text-sm">
                      Searching for group...
                    </span>
                  </div>
                )}

                {/* Group Info Preview - Enhanced */}
                {groupInfo && !isFetchingGroup && (
                  <div
                    className={`relative rounded-2xl p-6 border-2 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                      groupInfo.type === "FRIENDS"
                        ? "bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/50"
                        : "bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/50"
                    }`}
                  >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl"></div>

                    <div className="relative">
                      <div className="flex items-start gap-4 mb-6">
                        <div
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                            groupInfo.type === "FRIENDS"
                              ? "bg-blue-500/20 shadow-blue-500/20"
                              : "bg-green-500/20 shadow-green-500/20"
                          }`}
                        >
                          {groupInfo.type === "FRIENDS" ? (
                            <Users className="h-8 w-8 text-blue-400" />
                          ) : (
                            <Building className="h-8 w-8 text-green-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`text-2xl font-bold mb-2 ${
                              groupInfo.type === "FRIENDS"
                                ? "text-blue-400"
                                : "text-green-400"
                            }`}
                          >
                            {groupInfo.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3">
                            <span
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                                groupInfo.type === "FRIENDS"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-green-500/20 text-green-400"
                              }`}
                            >
                              {groupInfo.type === "FRIENDS"
                                ? "Friends Group"
                                : "Organization"}
                            </span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-400 text-sm font-medium">
                              {groupInfo.memberCount || 0} member
                              {groupInfo.memberCount !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Organization Department Notice */}
                      {groupInfo.type === "ORGANIZATION" && (
                        <div className="flex items-center gap-3 px-4 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                          <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                          <span className="text-sm text-yellow-400 font-medium">
                            Department information required for this
                            organization
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Department Input (only for Organization) */}
                {groupInfo?.type === "ORGANIZATION" && !isFetchingGroup && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <label
                      htmlFor="department"
                      className="block text-sm font-bold mb-3"
                    >
                      Your Department <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="department"
                      required
                      className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-xl px-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-all"
                      placeholder="e.g., Marketing, Engineering, Finance"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      disabled={isLoading}
                    />
                    <p className="mt-3 text-xs text-gray-500">
                      This helps organize members within the group
                    </p>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-zinc-800">
                  <Link
                    href="/dashboard"
                    className="px-6 py-3 bg-zinc-800 border border-zinc-700 rounded-xl font-medium hover:bg-zinc-700 transition-all text-center"
                  >
                    Cancel
                  </Link>
                  <button
                    onClick={handleSubmit}
                    disabled={
                      isLoading ||
                      isFetchingGroup ||
                      !groupInfo ||
                      (groupInfo?.type === "ORGANIZATION" && !department.trim())
                    }
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold hover:from-green-500 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Join Group Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            {/* Benefits Card */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <h3 className="font-bold mb-4 text-sm text-gray-400 uppercase tracking-wider">
                What You'll Get
              </h3>
              <div className="space-y-3">
                {[
                  {
                    icon: TrendingUp,
                    text: "Track shared expenses",
                    color: "text-blue-400",
                  },
                  {
                    icon: Users,
                    text: "Collaborate with members",
                    color: "text-green-400",
                  },
                  {
                    icon: Activity,
                    text: "Real-time balance updates",
                    color: "text-purple-400",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition-all"
                  >
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <span className="text-sm text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Pro Tip */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6">
              <h3 className="font-bold mb-2 text-sm text-green-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Pro Tip
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Groups are most effective when all members join early. Encourage
                everyone to sign up before adding expenses!
              </p>
            </div>{" "}
          </div>

          {/* Right Column - Help & Info */}
          <div className="space-y-6">
            {/* How to Join */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-400" />
                How to Join
              </h3>
              <div className="space-y-4">
                {[
                  {
                    step: "1",
                    text: "Get the 6-character code from admin",
                    icon: "🔑",
                  },
                  {
                    step: "2",
                    text: "Enter code to auto-load group details",
                    icon: "🔍",
                  },
                  {
                    step: "3",
                    text: "Add department (for organizations)",
                    icon: "🏢",
                  },
                  {
                    step: "4",
                    text: "Click join and start tracking!",
                    icon: "✨",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-zinc-800 group-hover:bg-green-500/20 text-gray-400 group-hover:text-green-400 text-sm font-bold transition-all">
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
          </div>
        </div>
      </main>
    </div>
  );
}
