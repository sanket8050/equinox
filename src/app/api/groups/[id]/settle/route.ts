import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { calculateSettlement, isGroupSettled } from "@/lib/settlement"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const groupId = resolvedParams.id

    if (!groupId) {
      return NextResponse.json(
        { error: "Group ID is required" },
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
        group: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!userMember || userMember.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only group admins can trigger settlement" },
        { status: 403 }
      )
    }

    // Organization groups don't have settlements (they don't track member balances)
    if (userMember.group.type === "ORGANIZATION") {
      return NextResponse.json(
        { error: "Settlement is not applicable for organization groups" },
        { status: 400 }
      )
    }

    // Get all group members with their current balances
    const members = userMember.group.members.map((member: any) => ({
      userId: member.userId,
      userName: member.user.name,
      balance: Number(member.balance)
    }))

    // Check if group is already settled
    if (isGroupSettled(members)) {
      return NextResponse.json({
        message: "Group is already settled",
        settlements: []
      })
    }

    // Calculate settlement transactions
    const settlements = calculateSettlement(members)

    // Create notifications for all members about settlement
    const notifications = userMember.group.members.map((member: any) => ({
      userId: member.userId,
      groupId: groupId,
      title: "Settlement Completed",
      message: `Group "${userMember.group.name}" has been settled with ${settlements.length} transactions`,
      type: "SETTLEMENT_UPDATE" as const
    }))

    await prisma.notification.createMany({
      data: notifications
    })

    // Reset all member balances to 0 after settlement
    await prisma.groupMember.updateMany({
      where: {
        groupId: groupId
      },
      data: {
        balance: 0
      }
    })

    return NextResponse.json({
      message: "Settlement completed successfully",
      settlements: settlements,
      totalTransactions: settlements.length
    })
  } catch (error) {
    console.error("Error settling group:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
