import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
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
    // Robustly derive group id to avoid undefined errors in production
    const groupId = resolvedParams?.id || request.nextUrl.pathname.split("/").pop()

    if (!groupId) {
      return NextResponse.json(
        { error: "Group id is required" },
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

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          
          include: {
            user: {
              select: {
                id: true,
                name: true
                
              }
            }
          }
        },
        transactions: {
          where: {
            isDeleted: false
          },
          include: {
            addedBy: {
              select: {
                name: true
              }
            },
            participants: {
              select: {
                userId: true,
                paid: true,
                owed: true
              }
            }
          },
          orderBy: {
            date: "desc"
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

    return NextResponse.json({ group })
  } catch (error) {
    console.error("Error fetching group:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
