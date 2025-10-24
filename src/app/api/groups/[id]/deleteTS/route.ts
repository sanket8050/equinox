// import { NextRequest, NextResponse } from "next/server"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
// import { prisma } from "@/lib/prisma"

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions)
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const transactionId = params.id

//     // Get transaction with all required relations
//     const transaction = await prisma.transaction.findUnique({
//       where: { id: transactionId },
//       include: {
//         group: {
//           include: {
//             members: true,
//           }
//         },
//         participants: true,
//       }
//     })

//     if (!transaction) {
//       return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
//     }

//     // Check permissions (admin or transaction creator)
//     const userMember = transaction.group.members.find(m => m.userId === session.user?.id)
//     const isAdmin = userMember?.role === "ADMIN"
//     const isCreator = transaction.addedById === session.user?.id

//     if (!isAdmin && !isCreator) {
//       return NextResponse.json({ error: "Not authorized" }, { status: 403 })
//     }

//     // Start a transaction to update everything atomically
//     await prisma.$transaction(async (tx) => {
//       // 1. For each participant, reverse their balance
//       for (const participant of transaction.participants) {
//         const paid = parseFloat(participant.paid.toString() || "0")
//         const owed = parseFloat(participant.owed.toString() || "0")
//         const netChange = paid - owed // What they paid minus what they owed

//         await tx.groupMember.updateMany({
//           where: {
//             groupId: transaction.groupId,
//             userId: participant.userId
//           },
//           data: {
//             // Subtract the original netChange to reverse it
//             balance: {
//               decrement: netChange
//             }
//           }
//         })
//       }

//       // 2. Mark transaction as deleted
//       await tx.transaction.update({
//         where: { id: transactionId },
//         data: { 
//           isDeleted: true,
//           deletedAt: new Date(),
//           deletedById: session.user?.id
//         }
//       })
//     })

//     return NextResponse.json({ success: true })

//   } catch (error) {
//     console.error("Error deleting transaction:", error)
//     return NextResponse.json(
//       { error: "Internal server error" }, 
//       { status: 500 }
//     )
//   }
// }