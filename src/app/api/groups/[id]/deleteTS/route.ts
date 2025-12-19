import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await params
    const groupId = resolvedParams.id

    // Get transactionId from query params
    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get("transactionId")

    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 })
    }

    // Get transaction with all required relations
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        group: {
          include: {
            members: true,
          }
        },
        participants: true,
      }
    })

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    // Verify transaction belongs to the group
    if (transaction.groupId !== groupId) {
      return NextResponse.json({ error: "Transaction does not belong to this group" }, { status: 403 })
    }

    // Check permissions (admin or transaction creator)
    const userMember = transaction.group.members.find(m => m.userId === session.user?.id)
    const isAdmin = userMember?.role === "ADMIN"
    const isCreator = transaction.addedById === session.user?.id

    if (!isAdmin && !isCreator) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    const isOrganizationGroup = transaction.group.type === "ORGANIZATION"

    // Start a transaction to update everything atomically
    await prisma.$transaction(async (tx) => {
      // 1. For FRIENDS groups, reverse member balances
      // For ORGANIZATION groups, balances are not affected
      if (!isOrganizationGroup) {
        for (const participant of transaction.participants) {
          const paid = parseFloat(participant.paid.toString() || "0")
          const owed = parseFloat(participant.owed.toString() || "0")
          const netChange = paid - owed // What they paid minus what they owed

          await tx.groupMember.updateMany({
            where: {
              groupId: transaction.groupId,
              userId: participant.userId
            },
            data: {
              // Subtract the original netChange to reverse it
              balance: {
                decrement: netChange
              }
            }
          })
        }
      }

      // 2. Mark transaction as deleted
      await tx.transaction.update({
        where: { id: transactionId },
        data: { 
          isDeleted: true,
          deletedAt: new Date(),
          deletedById: session.user?.id
        }
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting transaction:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" }, 
      { status: 500 }
    )
  }
}
