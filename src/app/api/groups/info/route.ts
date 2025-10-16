import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")

    if (!code) {
      return NextResponse.json(
        { error: "Group code is required" },
        { status: 400 }
      )
    }

    // Find group by code
    const group = await prisma.group.findUnique({
      where: { code: code.toUpperCase() },
      select: {
        id: true,
        name: true,
        type: true,
        code: true,
        _count: {
          select: {
            members: true
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

    return NextResponse.json({
      group: {
        id: group.id,
        name: group.name,
        type: group.type,
        code: group.code,
        memberCount: group._count.members
      }
    })
  } catch (error) {
    console.error("Error fetching group info:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}