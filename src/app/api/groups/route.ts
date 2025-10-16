import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateGroupCode } from "@/lib/utils"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Fetch all groups where user is a member
    const groupMembers = await prisma.groupMember.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        group: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            },
            _count: {
              select: {
                transactions: true
              }
            }
          }
        }
      }
    })

    // Transform the data to include user's role and balance in each group
    const groups = groupMembers.map((membership) => ({
      id: membership.group.id,
      name: membership.group.name,
      type: membership.group.type,
      code: membership.group.code,
      balance: membership.balance,
      role: membership.role,
      department: membership.department,
      members: membership.group.members.map((member) => ({
        id: member.id,
        role: member.role,
        balance: member.balance,
        department: member.department,
        user: {
          id: member.user.id,
          name: member.user.name,
          email: member.user.email
        }
      })),
      _count: membership.group._count
    }))

    return NextResponse.json({ groups })
  } catch (error) {
    console.error("Error fetching groups:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { name, type, description } = await request.json()

    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 }
      )
    }

    // Generate unique group code
    let code: string
    let isUnique = false
    
    while (!isUnique) {
      code = generateGroupCode()
      const existingGroup = await prisma.group.findUnique({
        where: { code }
      })
      if (!existingGroup) {
        isUnique = true
      }
    }

    // Create group and add creator as admin
    const group = await prisma.group.create({
      data: {
        name,
        type,
        code: code!,
        createdById: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: "ADMIN",
            balance: 0
          }
        }
      }
    })

    return NextResponse.json({ group }, { status: 201 })
  } catch (error) {
    console.error("Error creating group:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}