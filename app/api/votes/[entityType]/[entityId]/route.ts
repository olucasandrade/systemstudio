import { auth } from "@/app/auth/server";
import { database } from "@/app/database";
import { NextRequest, NextResponse } from "next/server";

// DELETE /api/votes/:entityType/:entityId - Delete user's vote
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ entityType: string; entityId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { entityType, entityId } = await params;

    if (!["challenge", "solution", "comment"].includes(entityType)) {
      return NextResponse.json(
        { error: "Invalid entityType" },
        { status: 400 }
      );
    }

    const result = await database.$transaction(async (tx) => {
      let existing;
      if (entityType === "challenge") {
        existing = await tx.vote.findUnique({
          where: {
            userId_challengeId: {
              userId,
              challengeId: entityId,
            },
          },
        });
      } else if (entityType === "solution") {
        existing = await tx.vote.findUnique({
          where: {
            userId_solutionId: {
              userId,
              solutionId: entityId,
            },
          },
        });
      } else if (entityType === "comment") {
        existing = await tx.vote.findUnique({
          where: {
            userId_commentId: {
              userId,
              commentId: entityId,
            },
          },
        });
      }

      if (!existing) {
        return { upvotesCount: 0, downvotesCount: 0 };
      }

      await tx.vote.delete({
        where: { id: existing.id },
      });

      let upvotes, downvotes;
      if (entityType === "challenge") {
        upvotes = await tx.vote.count({
          where: { challengeId: entityId, voteType: "upvote" },
        });
        downvotes = await tx.vote.count({
          where: { challengeId: entityId, voteType: "downvote" },
        });
      } else if (entityType === "solution") {
        upvotes = await tx.vote.count({
          where: { solutionId: entityId, voteType: "upvote" },
        });
        downvotes = await tx.vote.count({
          where: { solutionId: entityId, voteType: "downvote" },
        });
      } else if (entityType === "comment") {
        upvotes = await tx.vote.count({
          where: { commentId: entityId, voteType: "upvote" },
        });
        downvotes = await tx.vote.count({
          where: { commentId: entityId, voteType: "downvote" },
        });
      }

      if (entityType === "solution") {
        await tx.solution.update({
          where: { id: entityId },
          data: {
            upvotesCount: upvotes,
            downvotesCount: downvotes,
          },
        });
      } else if (entityType === "comment") {
        await tx.comment.update({
          where: { id: entityId },
          data: {
            upvotesCount: upvotes,
            downvotesCount: downvotes,
          },
        });
      } else if (entityType === "challenge") {
        await tx.challenge.update({
          where: { id: entityId },
          data: {
            upvotesCount: upvotes,
            downvotesCount: downvotes,
          },
        });
      }

      return { upvotesCount: upvotes, downvotesCount: downvotes };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting vote:", error);
    return NextResponse.json(
      { error: "Failed to delete vote" },
      { status: 500 }
    );
  }
}

