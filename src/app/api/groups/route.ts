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

    const groups = await prisma.groupMember.findMany({
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
                    name: true
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

    const formattedGroups = groups.map((member: any) => ({
      id: member.group.id,
      name: member.group.name,
      type: member.group.type,
      code: member.group.code,
      balance: member.balance,
      members: member.group.members,
      _count: member.group._count
    }))

    return NextResponse.json({ groups: formattedGroups })
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
