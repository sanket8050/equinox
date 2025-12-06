import React, { useEffect, useState } from "react"
import { DollarSign, TrendingUp, Calculator, Building } from "lucide-react"
import { StatCard } from "@/app/groups/[id]/page" // kept as requested
// import { Stats } from "fs"
// ...existing code...

type DonationResponse = {
  donations?: any[]
  totalDonations?: number
  totalAmount?: string
  donationsByMethod?: any[]
  pagination?: { page: number; limit: number; totalPages: number }
  userSpent?: string
}

export default function Stats({ group, totalSpent, departmentsCount }: { group: any; totalSpent: number; departmentsCount: number }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [donationData, setDonationData] = useState<DonationResponse | null>(null)

  const currentPage = 1
  const searchTerm = ""
  const filterMethod = ""

  useEffect(() => {
    if (!group) return
    fetchDonations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group])

  const fetchDonations = async () => {
    if (!group) return

    try {
      setIsLoading(true)
      setError(null)

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
      console.log("data in new ");
      console.log(data)
    } catch (err) {
      console.error("Error fetching donations:", err)
      setError("Failed to load donations")
    } finally {
      setIsLoading(false)
    }
  }

  const totalCollectedRaw = donationData?.totalAmount ? parseFloat(String(donationData.totalAmount)) : 0
  const totalCollected = Number.isFinite(totalCollectedRaw) ? Math.round(totalCollectedRaw * 100) / 100 : 0
  const remainingBalance = Math.round((totalCollected - (totalSpent ?? 0)) * 100) / 100

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(Math.round(val * 100) / 100)

  return (
    <>
      <StatCard title="Total Collected" value={isLoading ? "...": formatCurrency(totalCollected)} icon={DollarSign} color="blue-100" />
      <StatCard title="Total Spent" value={formatCurrency(totalSpent ?? 0)} icon={TrendingUp} color="red-100" />
      <StatCard title="Remaining Balance" value={formatCurrency(remainingBalance)} icon={Calculator} color="green-400" />
      <StatCard title="Departments" value={departmentsCount ?? 0} icon={Building} color="purple-100" />
    </>
    
  )
}
 