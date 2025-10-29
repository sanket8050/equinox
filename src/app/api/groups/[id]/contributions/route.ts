// import { NextRequest, NextResponse } from "next/server"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
// import { prisma } from "@/lib/prisma"

// export async function POST(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       )
//     }

//     const groupId = params.id
//     const { amount } = await request.json()

//     if (!amount || amount <= 0) {
//       return NextResponse.json(
//         { error: "Valid amount is required" },
//         { status: 400 }
//       )
//     }

//     // Check if user is a member of this group
//     const userMember = await prisma.groupMember.findUnique({
//       where: {
//         userId_groupId: {
//           userId: session.user.id,
//           groupId: groupId
//         }
//       },
//       include: {
//         group: true
//       }
//     })

//     if (!userMember) {
//       return NextResponse.json(
//         { error: "Access denied" },
//         { status: 403 }
//       )
//     }

//     // Check if group is organization type
//     if (userMember.group.type !== "ORGANIZATION") {
//       return NextResponse.json(
//         { error: "Initial contributions only allowed for organization groups" },
//         { status: 400 }
//       )
//     }

//     // Create initial contribution
//     const contribution = await prisma.initialContribution.create({
//       data: {
//         groupId: groupId,
//         userId: session.user.id,
//         amount: amount
//       }
//     })

//     // Update member balance
//     await prisma.groupMember.update({
//       where: { id: userMember.id },
//       data: {
//         balance: {
//           increment: amount
//         }
//       }
//     })

//     return NextResponse.json({ contribution }, { status: 201 })
//   } catch (error) {
//     console.error("Error creating contribution:", error)
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     )
//   }
// }

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       )
//     }

//     const groupId = params.id

//     // Check if user is a member of this group
//     const userMember = await prisma.groupMember.findUnique({
//       where: {
//         userId_groupId: {
//           userId: session.user.id,
//           groupId: groupId
//         }
//       }
//     })

//     if (!userMember) {
//       return NextResponse.json(
//         { error: "Access denied" },
//         { status: 403 }
//       )
//     }

//     // Get aggregated funds data
//     const contributions = await prisma.initialContribution.findMany({
//       where: { groupId },
//       include: {
//         user: {
//           select: {
//             name: true
//           }
//         }
//       }
//     })

//     const totalCollected = contributions.reduce((sum, c) => sum + Number(c.amount), 0)
    
//     // Get total spent from transactions
//     const transactions = await prisma.transaction.findMany({
//       where: { 
//         groupId,
//         isDeleted: false
//       }
//     })
    
//     const totalSpent = transactions.reduce((sum, t) => sum + Number(t.amount), 0)
//     const remainingBalance = totalCollected - totalSpent

//     return NextResponse.json({
//       totalCollected,
//       totalSpent,
//       remainingBalance,
//       contributions
//     })
//   } catch (error) {
//     console.error("Error fetching contributions:", error)
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     )
//   }
// }
