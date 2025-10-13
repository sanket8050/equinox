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
      donorName, 
      donorEmail, 
      amount, 
      paymentMethod, 
      recipientId, 
      notes 
    } = await request.json()

    if (!donorName || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: "Donor name, amount, and payment method are required" },
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

    // Check if group is organization type
    if (userMember.group.type !== "ORGANIZATION") {
      return NextResponse.json(
        { error: "Donations only allowed for organization groups" },
        { status: 400 }
      )
    }

    // Verify recipient is a group member if provided
    if (recipientId) {
      const recipientMember = await prisma.groupMember.findUnique({
        where: {
          userId_groupId: {
            userId: recipientId,
            groupId: groupId
          }
        }
      })

      if (!recipientMember) {
        return NextResponse.json(
          { error: "Recipient must be a group member" },
          { status: 400 }
        )
      }
    }

    // Create donation
    const donation = await prisma.donation.create({
      data: {
        groupId: groupId,
        donorName,
        donorEmail,
        amount: amount,
        paymentMethod,
        recipientId: recipientId || null,
        receivedBy: session.user.id,
        notes
      },
      include: {
        recipient: {
          select: {
            name: true
          }
        },
        receivedByUser: {
          select: {
            name: true
          }
        }
      }
    })

    // Create notifications for all group members
    const groupMembers = await prisma.groupMember.findMany({
      where: { groupId },
      select: { userId: true }
    })

    await prisma.notification.createMany({
      data: groupMembers.map((member) => ({
        userId: member.userId,
        groupId: groupId,
        title: "New Donation Received",
        message: `$${amount} donation from ${donorName} via ${paymentMethod}`,
        type: "DONATION_ADDED"
      }))
    })

    return NextResponse.json({ donation }, { status: 201 })
  } catch (error) {
    console.error("Error creating donation:", error)
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
      }
    })

    if (!userMember) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    // Get donations with pagination
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const donations = await prisma.donation.findMany({
      where: { groupId },
      include: {
        recipient: {
          select: {
            name: true
          }
        },
        receivedByUser: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      },
      skip,
      take: limit
    })

    const totalDonations = await prisma.donation.count({
      where: { groupId }
    })

    const totalAmount = await prisma.donation.aggregate({
      where: { groupId },
      _sum: {
        amount: true
      }
    })

    // Get donations by payment method
    const donationsByMethod = await prisma.donation.groupBy({
      by: ['paymentMethod'],
      where: { groupId },
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    })

    return NextResponse.json({
      donations,
      totalDonations,
      totalAmount: totalAmount._sum.amount || 0,
      donationsByMethod,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalDonations / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching donations:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
