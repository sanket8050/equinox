import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const groupId = params.id
    const { departmentName } = await request.json()

    if (!departmentName || departmentName.trim() === "") {
      return NextResponse.json(
        { error: "Department name is required" },
        { status: 400 }
      )
    }

    // Check if user is an admin of this group
    const userMember = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: session.user.id,
          groupId: groupId
        }
      },
      include: {
        group: true
      }
    })

    if (!userMember || userMember.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only group admins can add departments" },
        { status: 403 }
      )
    }

    // Check if group is organization type
    if (userMember.group.type !== "ORGANIZATION") {
      return NextResponse.json(
        { error: "Departments only allowed for organization groups" },
        { status: 400 }
      )
    }

    // Check if department already exists
    const existingDepartments = userMember.group.departments || []
    if (existingDepartments.includes(departmentName.trim())) {
      return NextResponse.json(
        { error: "Department already exists" },
        { status: 400 }
      )
    }

    // Add department to group
    const updatedGroup = await prisma.group.update({
      where: { id: groupId },
      data: {
        departments: {
          push: departmentName.trim()
        }
      }
    })

    return NextResponse.json({ 
      group: updatedGroup,
      message: "Department added successfully" 
    })
  } catch (error) {
    console.error("Error adding department:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const groupId = params.id
    const { searchParams } = new URL(request.url)
    const departmentName = searchParams.get('department')

    if (!departmentName) {
      return NextResponse.json(
        { error: "Department name is required" },
        { status: 400 }
      )
    }

    // Check if user is an admin of this group
    const userMember = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: session.user.id,
          groupId: groupId
        }
      },
      include: {
        group: true
      }
    })

    if (!userMember || userMember.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only group admins can remove departments" },
        { status: 403 }
      )
    }

    // Check if department exists
    const existingDepartments = userMember.group.departments || []
    if (!existingDepartments.includes(departmentName)) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      )
    }

    // Check if department has any transactions
    const departmentTransactions = await prisma.transaction.count({
      where: {
        groupId,
        department: departmentName,
        isDeleted: false
      }
    })

    if (departmentTransactions > 0) {
      return NextResponse.json(
        { error: "Cannot delete department with existing transactions" },
        { status: 400 }
      )
    }

    // Remove department from group
    const updatedDepartments = existingDepartments.filter(dep => dep !== departmentName)
    const updatedGroup = await prisma.group.update({
      where: { id: groupId },
      data: {
        departments: updatedDepartments
      }
    })

    return NextResponse.json({ 
      group: updatedGroup,
      message: "Department removed successfully" 
    })
  } catch (error) {
    console.error("Error removing department:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const groupId = params.id

    // Check if user is a member of this group
    const userMember = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: session.user.id,
          groupId: groupId
        }
      },
      include: {
        group: true
      }
    })

    if (!userMember) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    // Get department-wise analytics
    const departments = userMember.group.departments || []
    
    const departmentAnalytics = await Promise.all(
      departments.map(async (department) => {
        const transactions = await prisma.transaction.findMany({
          where: {
            groupId,
            department,
            isDeleted: false
          }
        })

        const totalSpent = transactions.reduce((sum, t) => sum + Number(t.amount), 0)
        const transactionCount = transactions.length

        return {
          name: department,
          totalSpent,
          transactionCount,
          transactions
        }
      })
    )

    return NextResponse.json({
      departments,
      analytics: departmentAnalytics
    })
  } catch (error) {
    console.error("Error fetching departments:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
