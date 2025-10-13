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
    const { description, amount, date, paidBy, participants } = await request.json()

    if (!description || !amount || !paidBy || !participants || participants.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if user is a member of this group
    const userMember = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: session.user.id,
          groupId: groupId
        }
      }
    })

    if (!userMember) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    // Verify all participants are members of the group
    const groupMembers = await prisma.groupMember.findMany({
      where: {
        groupId: groupId,
        userId: {
          in: participants
        }
      }
    })

    if (groupMembers.length !== participants.length) {
      return NextResponse.json(
        { error: "Some participants are not group members" },
        { status: 400 }
      )
    }

    // Calculate amount per person
    const amountPerPerson = amount / participants.length

    // Create transaction with participants
    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount,
        date: new Date(date),
        groupId,
        addedById: session.user.id,
        participants: {
          create: participants.map((userId: string) => ({
            userId,
            paid: userId === paidBy ? amount : 0,
            owed: userId === paidBy ? 0 : amountPerPerson
          }))
        }
      }
    })

    // Update member balances
    await Promise.all(
      groupMembers.map(async (member: any) => {
        const participant = participants.find((id: string) => id === member.userId)
        if (participant) {
          const paid = participant === paidBy ? amount : 0
          const owed = participant === paidBy ? 0 : amountPerPerson
          const balanceChange = paid - owed

          await prisma.groupMember.update({
            where: { id: member.id },
            data: {
              balance: {
                increment: balanceChange
              }
            }
          })
        }
      })
    )

    // Create notifications for all group members except the one who added the transaction
    const otherMembers = groupMembers.filter((m: any) => m.userId !== session.user.id)
    if (otherMembers.length > 0) {
      await prisma.notification.createMany({
        data: otherMembers.map((member: any) => ({
          userId: member.userId,
          groupId: groupId,
          title: "New Expense Added",
          message: `${session.user?.name} added "${description}" ($${amount.toFixed(2)})`,
          type: "EXPENSE_ADDED"
        }))
      })
    }

    return NextResponse.json({ transaction }, { status: 201 })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
