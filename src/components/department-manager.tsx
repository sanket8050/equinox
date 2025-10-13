"use client"

import { useState } from "react"
import { Building, Plus, Trash2, X } from "lucide-react"

interface DepartmentManagerProps {
  groupId: string
  departments: string[]
  onDepartmentsChange: (departments: string[]) => void
  isAdmin: boolean
}

export default function DepartmentManager({ 
  groupId, 
  departments, 
  onDepartmentsChange, 
  isAdmin 
}: DepartmentManagerProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [newDepartment, setNewDepartment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDepartment.trim()) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/groups/${groupId}/departments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          departmentName: newDepartment.trim()
        }),
      })

      if (response.ok) {
        const data = await response.json()
        onDepartmentsChange(data.group.departments)
        setNewDepartment("")
        setShowAddModal(false)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to add department")
      }
    } catch (error) {
      console.error("Error adding department:", error)
      setError("Failed to add department")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveDepartment = async (departmentName: string) => {
    if (!confirm(`Are you sure you want to remove the "${departmentName}" department?`)) {
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/groups/${groupId}/departments?department=${encodeURIComponent(departmentName)}`, {
        method: "DELETE",
      })

      if (response.ok) {
        const data = await response.json()
        onDepartmentsChange(data.group.departments)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to remove department")
      }
    } catch (error) {
      console.error("Error removing department:", error)
      setError("Failed to remove department")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Building className="h-5 w-5 mr-2" />
          Departments
        </h3>
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Department
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {departments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">No departments configured</p>
          <p className="text-sm">Add departments to organize expenses and track spending by team.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((department) => (
            <div key={department} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm font-medium text-gray-900">{department}</span>
              {isAdmin && (
                <button
                  onClick={() => handleRemoveDepartment(department)}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Department</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddDepartment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name
                </label>
                <input
                  type="text"
                  required
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  placeholder="e.g., Management, Decoration, Volunteers"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !newDepartment.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? "Adding..." : "Add Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
