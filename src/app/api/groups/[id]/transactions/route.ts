import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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

    // Await params in Next.js 15+
    const resolvedParams = await params
    const groupId = resolvedParams.id

    if (!groupId) {
      return NextResponse.json(
        { error: "Group ID is required" },
        { status: 400 }
      )
    }
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

    // For organization groups, expenses should NOT be split between members
    // They are organizational expenses that don't affect member balances
    const isOrganizationGroup = userMember.group.type === "ORGANIZATION";
    
    // Calculate shares - equal or custom (only for FRIENDS groups)
    let participantShares: { userId: string; share: number }[] = []

    if (isOrganizationGroup) {
      // For organization groups, no splitting - just record who paid
      participantShares = []
    } else if (customShares && Object.keys(customShares).length === participants.length) {
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
      // Equal sharing for FRIENDS groups
      const amountPerPerson = amount / participants.length
      participantShares = participants.map((userId: string) => ({
        userId,
        share: amountPerPerson
      }))
    }

    // Prepare TransactionParticipant entries
    const participantsMap = new Map<string, { paid: number, owed: number }>();

    // Initialize payer
    participantsMap.set(paidBy, { paid: amount, owed: 0 });

    // Add shares (owed) - only for FRIENDS groups
    if (!isOrganizationGroup) {
      participantShares.forEach(({ userId, share }) => {
        const current = participantsMap.get(userId) || { paid: 0, owed: 0 };
        current.owed += share;
        participantsMap.set(userId, current);
      });
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
          create: Array.from(participantsMap.entries()).map(([userId, { paid, owed }]) => ({
            userId,
            paid,
            owed
          }))
        }
      }
    })

    // Update member balances - ONLY for FRIENDS groups
    // Organization groups don't affect member balances
    if (!isOrganizationGroup) {
      const numParticipants = participants.length;
      const amountPerPerson = numParticipants > 0 ? amount / numParticipants : 0;

      // Get all affected users: participants + paidBy
      const affectedUsers = new Set([...participants, paidBy]);

      // Fetch group members for all affected users
      const groupMembersForUpdate = await prisma.groupMember.findMany({
        where: {
          groupId: groupId,
          userId: {
            in: Array.from(affectedUsers)
          }
        }
      });

      await Promise.all(
        groupMembersForUpdate.map(async (member: any) => {
          const paidByMember = member.userId === paidBy ? amount : 0;
          const share = participants.includes(member.userId) ? amountPerPerson : 0; // Note: this assumes equal split for balance update. 
          // If custom shares are used, we should use participantShares to find the share.

          let userShare = 0;
          if (customShares) {
            const pShare = participantShares.find(p => p.userId === member.userId);
            userShare = pShare ? pShare.share : 0;
          } else {
            userShare = participants.includes(member.userId) ? amountPerPerson : 0;
          }

          const balanceChange = paidByMember - userShare;

          await prisma.groupMember.update({
            where: { id: member.id },
            data: {
              balance: {
                increment: balanceChange
              }
            }
          });
        })
      );
    }

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
    // Log more details for debugging
    if (error instanceof Error) {
      console.error("Error details:", error.message, error.stack)
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}