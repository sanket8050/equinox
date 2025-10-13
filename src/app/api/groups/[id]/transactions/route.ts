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
    const { 
      description, 
      amount, 
      date, 
      paidBy, 
      participants, 
      department,
      category,
      customShares 
    } = await request.json()

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

    // Validate department for organization groups
    if (userMember.group.type === "ORGANIZATION" && department) {
      const validDepartments = userMember.group.departments || []
      if (!validDepartments.includes(department)) {
        return NextResponse.json(
          { error: "Invalid department" },
          { status: 400 }
        )
      }
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

    // Calculate shares - equal or custom
    let participantShares: { userId: string; share: number }[] = []
    
    if (customShares && Object.keys(customShares).length === participants.length) {
      // Validate custom shares
      const totalCustomShare = Object.values(customShares).reduce((sum: number, share: any) => sum + Number(share), 0)
      if (Math.abs(totalCustomShare - amount) > 0.01) {
        return NextResponse.json(
          { error: "Custom shares must equal total amount" },
          { status: 400 }
        )
      }
      
      participantShares = participants.map((userId: string) => ({
        userId,
        share: Number(customShares[userId]) || 0
      }))
    } else {
      // Equal sharing
      const amountPerPerson = amount / participants.length
      participantShares = participants.map((userId: string) => ({
        userId,
        share: amountPerPerson
      }))
    }

    // Create transaction with participants
    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount,
        date: new Date(date),
        groupId,
        addedById: session.user.id,
        department: department || null,
        category: category || null,
        participants: {
          create: participantShares.map(({ userId, share }) => ({
            userId,
            paid: userId === paidBy ? amount : 0,
            owed: userId === paidBy ? 0 : share
          }))
        }
      }
    })

    // Update member balances
    await Promise.all(
      groupMembers.map(async (member: any) => {
        const participantShare = participantShares.find(p => p.userId === member.userId)
        if (participantShare) {
          const paid = participantShare.userId === paidBy ? amount : 0
          const owed = participantShare.userId === paidBy ? 0 : participantShare.share
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
