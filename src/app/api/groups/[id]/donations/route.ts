import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

// ✅ POST — Add a new donation
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const groupId = params.id
    const { donorName, donorEmail, amount, paymentMethod, recipientId, notes } =
      await request.json()

    if (!donorName || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: "Donor name, amount, and payment method are required" },
        { status: 400 }
      )
    }

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const userMember = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: session.user.id,
          groupId,
        },
      },
      include: { group: true },
    })

    if (!userMember) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    if (userMember.group.type !== "ORGANIZATION") {
      return NextResponse.json(
        { error: "Donations are only allowed for organization groups" },
        { status: 400 }
      )
    }

    if (recipientId) {
      const recipientMember = await prisma.groupMember.findUnique({
        where: {
          userId_groupId: {
            userId: recipientId,
            groupId,
          },
        },
      })
      if (!recipientMember) {
        return NextResponse.json(
          { error: "Recipient must be a group member" },
          { status: 400 }
        )
      }
    }

    const donation = await prisma.donation.create({
      data: {
        groupId,
        donorName,
        donorEmail,
        amount,
        paymentMethod,
        recipientId: recipientId || null,
        receivedBy: session.user.id,
        notes,
      },
      include: {
        recipient: { select: { name: true } },
        receivedByUser: { select: { name: true } },
      },
    })

    const groupMembers = await prisma.groupMember.findMany({
      where: { groupId },
      select: { userId: true },
    })

    await prisma.notification.createMany({
      data: groupMembers.map((member) => ({
        userId: member.userId,
        groupId,
        title: "New Donation Received",
        message: `₹${amount} donation from ${donorName} via ${paymentMethod}`,
        type: "DONATION_ADDED",
      })),
    })

    return NextResponse.json({ donation }, { status: 201 })
  } catch (error) {
    console.error("Error creating donation:", error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// ✅ GET — Fetch donations, totals, and summary analytics
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const groupId = params.id

    const userMember = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: session.user.id,
          groupId,
        },
      },
    })

    if (!userMember) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const donations = await prisma.donation.findMany({
      where: { groupId },
      include: {
        recipient: { select: { name: true } },
        receivedByUser: { select: { name: true } },
      },
      orderBy: { date: "desc" },
      skip,
      take: limit,
    })

    const totalDonations = await prisma.donation.count({ where: { groupId } })
    const totalAmount = await prisma.donation.aggregate({
      where: { groupId },
      _sum: { amount: true },
    })

    const donationsByMethod = await prisma.donation.groupBy({
      by: ["paymentMethod"],
      where: { groupId },
      _sum: { amount: true },
      _count: { id: true },
    })

    const userTotal = await prisma.donation.aggregate({
      where: { groupId, receivedBy: session.user.id },
      _sum: { amount: true },
    })

    return NextResponse.json({
      donations,
      totalDonations,
      totalAmount: totalAmount._sum.amount || 0,
      donationsByMethod,
      userSpent: userTotal._sum.amount || 0,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalDonations / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching donations:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// ✅ PATCH — Edit donation (Admin only)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const groupId = params.id
    const { donationId, donorName, amount, paymentMethod, notes } = await request.json()

    if (!donationId) {
      return NextResponse.json({ error: "Donation ID is required" }, { status: 400 })
    }

    const admin = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: session.user.id,
          groupId,
        },
      },
    })

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admin can edit donations" }, { status: 403 })
    }

    const updatedDonation = await prisma.donation.update({
      where: { id: donationId },
      data: {
        donorName,
        amount,
        paymentMethod,
        notes,
      },
    })

    return NextResponse.json({ updatedDonation }, { status: 200 })
  } catch (error) {
    console.error("Error updating donation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// ✅ DELETE — Remove donation (Admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const groupId = params.id
    const { donationId } = await request.json()

    if (!donationId) {
      return NextResponse.json({ error: "Donation ID is required" }, { status: 400 })
    }

    const admin = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: session.user.id,
          groupId,
        },
      },
    })

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admin can delete donations" }, { status: 403 })
    }

    await prisma.donation.delete({ where: { id: donationId } })

    return NextResponse.json({ message: "Donation deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting donation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
