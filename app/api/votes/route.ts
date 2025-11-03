import { auth } from "@/app/auth/server";
import { database } from "@/app/database";
import { NextRequest, NextResponse } from "next/server";

// POST /api/votes - Create or update a vote
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { entityType, entityId, voteType } = body;

    // Validate inputs
    if (!["challenge", "solution", "comment"].includes(entityType)) {
      return NextResponse.json(
        { error: "Invalid entityType. Must be 'challenge', 'solution', or 'comment'" },
        { status: 400 }
      );
    }

    if (!["upvote", "downvote"].includes(voteType)) {
      return NextResponse.json(
        { error: "Invalid voteType. Must be 'upvote' or 'downvote'" },
        { status: 400 }
      );
    }

    if (!entityId) {
      return NextResponse.json(
        { error: "entityId is required" },
        { status: 400 }
      );
    }

    // Perform atomic vote operation in transaction
    const result = await database.$transaction(async (tx) => {
      // Find existing vote using the correct unique constraint
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

      // Create or update vote
      if (!existing) {
        const voteData: { userId: string, voteType: string, challengeId?: string, solutionId?: string, commentId?: string } = {
          userId,
          voteType,
        };
        
        // Set the appropriate foreign key based on entity type
        if (entityType === "challenge") {
          voteData.challengeId = entityId;
        } else if (entityType === "solution") {
          voteData.solutionId = entityId;
        } else if (entityType === "comment") {
          voteData.commentId = entityId;
        }

        await tx.vote.create({
          data: voteData,
        });
      } else if (existing.voteType !== voteType) {
        await tx.vote.update({
          where: { id: existing.id },
          data: { voteType },
        });
      }
      // If same vote type, it's a no-op

      // Recompute counts from vote table using the correct foreign key
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

      // Update entity counters
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

      return { upvotesCount: upvotes, downvotesCount: downvotes, userVote: voteType };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating/updating vote:", error);
    return NextResponse.json(
      { error: "Failed to process vote" },
      { status: 500 }
    );
  }
}

