import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { code, department } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: "Group code is required" },
        { status: 400 }
      )
    }

    // Find group by code
    const group = await prisma.group.findUnique({
      where: { code: code.toUpperCase() },
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
    })

    if (!group) {
      return NextResponse.json(
        { error: "Group not found" },
        { status: 404 }
      )
    }

    // Check if user is already a member
    const existingMember = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: session.user.id,
          groupId: group.id
        }
      }
    })

    if (existingMember) {
      return NextResponse.json(
        { error: "You are already a member of this group" },
        { status: 400 }
      )
    }

    // Add user to group as a member
    const groupMember = await prisma.groupMember.create({
      data: {
        userId: session.user.id,
        groupId: group.id,
        role: "MEMBER",
        balance: 0,
        department: department || null
      }
    })

    // Create notification for group admins
    const admins = await prisma.groupMember.findMany({
      where: {
        groupId: group.id,
        role: "ADMIN"
      }
    })

    if (admins.length > 0) {
      await prisma.notification.createMany({
        data: admins.map((admin: any) => ({
          userId: admin.userId,
          groupId: group.id,
          title: "New Member Joined",
          message: `${session.user?.name} joined "${group.name}"`,
          type: "INFO"
        }))
      })
    }

    return NextResponse.json({ 
      message: "Successfully joined group",
      group: {
        id: group.id,
        name: group.name,
        type: group.type,
        code: group.code,
        members: group.members
      }
    })
  } catch (error) {
    console.error("Error joining group:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
