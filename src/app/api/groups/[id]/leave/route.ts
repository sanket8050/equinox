import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const groupId = params.id;
    const leavingUserId = session.user.id;

    // Fetch member info along with group details
    const member = await prisma.groupMember.findUnique({
      where: { userId_groupId: { userId: leavingUserId, groupId } },
      include: {
        group: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: "You are not part of this group." }, { status: 403 });
    }

    // Check if the user has any pending balance
    if (member.balance.toNumber() !== 0) {
      return NextResponse.json(
        { error: "You must settle your balance before leaving the group." },
        { status: 400 }
      );
    }

    // Handle admin case
    if (member.role === "ADMIN") {
      const otherAdmins = member.group.members.filter(
        (m) => m.role === "ADMIN" && m.userId !== leavingUserId
      );

      // If no other admin exists, assign a new admin (first member)
      if (otherAdmins.length === 0) {
        const firstMember = member.group.members.find((m) => m.userId !== leavingUserId);
        if (firstMember) {
          await prisma.groupMember.update({
            where: { id: firstMember.id },
            data: { role: "ADMIN" },
          });
        }
      }
    }

    // Remove member from group
    await prisma.groupMember.delete({
      where: { userId_groupId: { userId: leavingUserId, groupId } },
    });

    // Notify remaining group members
    const otherMembers = member.group.members.filter((m) => m.userId !== leavingUserId);

    if (otherMembers.length > 0) {
      await prisma.notification.createMany({
        data: otherMembers.map((m) => ({
          userId: m.userId,
          groupId,
          title: "Member Left Group",
          message: `${session.user?.name} has left the group.`,
          type: "MEMBER_LEFT",
        })),
      });
    }

    return NextResponse.json({ message: "You have left the group successfully." });
  } catch (error) {
    console.error("Error leaving group:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
