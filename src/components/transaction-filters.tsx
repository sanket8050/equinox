"use client"

import { useState } from "react"
import { Search, Filter, Calendar, DollarSign, User } from "lucide-react"

interface TransactionFiltersProps {
  onFiltersChange: (filters: TransactionFilters) => void
  departments?: string[]
  members?: Array<{ id: string; user: { name: string } }>
  groupType: "FRIENDS" | "ORGANIZATION"
}

interface TransactionFilters {
  search: string
  dateFrom: string
  dateTo: string
  amountMin: string
  amountMax: string
  department: string
  category: string
  paidBy: string
  showDeleted: boolean
}

const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transportation", 
  "Accommodation",
  "Entertainment",
  "Supplies",
  "Equipment",
  "Marketing",
  "Decoration",
  "Volunteer",
  "Other"
]

export default function TransactionFilters({ 
  onFiltersChange, 
  departments = [], 
  members = [],
  groupType 
}: TransactionFiltersProps) {
  const [filters, setFilters] = useState<TransactionFilters>({
    search: "",
    dateFrom: "",
    dateTo: "",
    amountMin: "",
    amountMax: "",
    department: "",
    category: "",
    paidBy: "",
    showDeleted: false
  })

  const [showFilters, setShowFilters] = useState(false)

  const updateFilter = (key: keyof TransactionFilters, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: TransactionFilters = {
      search: "",
      dateFrom: "",
      dateTo: "",
      amountMin: "",
      amountMax: "",
      department: "",
      category: "",
      paidBy: "",
      showDeleted: false
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== "" && value !== false
  )

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      {/* Search Bar */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
            showFilters || hasActiveFilters
              ? "border-blue-500 text-blue-600 bg-blue-50"
              : "border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
              !
            </span>
          )}
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                From Date
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => updateFilter("dateFrom", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                To Date
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => updateFilter("dateTo", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Amount Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Min Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={filters.amountMin}
                onChange={(e) => updateFilter("amountMin", e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Max Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={filters.amountMax}
                onChange={(e) => updateFilter("amountMax", e.target.value)}
                placeholder="No limit"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Department (Organization only) */}
            {groupType === "ORGANIZATION" && departments.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={filters.department}
                  onChange={(e) => updateFilter("department", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => updateFilter("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All categories</option>
                {EXPENSE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Paid By */}
            {members.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Paid By
                </label>
                <select
                  value={filters.paidBy}
                  onChange={(e) => updateFilter("paidBy", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All members</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.user.name}>
                      {member.user.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Additional Options */}
          <div className="mt-4 flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.showDeleted}
                onChange={(e) => updateFilter("showDeleted", e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Show deleted transactions</span>
            </label>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: "{filters.search}"
              </span>
            )}
            {filters.dateFrom && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                From: {filters.dateFrom}
              </span>
            )}
            {filters.dateTo && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                To: {filters.dateTo}
              </span>
            )}
            {filters.amountMin && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Min: ${filters.amountMin}
              </span>
            )}
            {filters.amountMax && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Max: ${filters.amountMax}
              </span>
            )}
            {filters.department && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Dept: {filters.department}
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Category: {filters.category}
              </span>
            )}
            {filters.paidBy && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Paid by: {filters.paidBy}
              </span>
            )}
            {filters.showDeleted && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Including deleted
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
