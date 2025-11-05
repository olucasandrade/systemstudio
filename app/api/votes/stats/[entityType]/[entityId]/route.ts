import { database } from "@/app/database";
import { NextRequest, NextResponse } from "next/server";

// GET /api/votes/stats/:entityType/:entityId - Get detailed vote stats for an entity
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ entityType: string; entityId: string }> }
) {
  try {
    const { entityType, entityId } = await params;

    if (!["challenge", "solution", "comment"].includes(entityType)) {
      return NextResponse.json(
        { error: "Invalid entityType" },
        { status: 400 }
      );
    }

    let upvotes = 0, downvotes = 0;
    if (entityType === "challenge") {
      [upvotes, downvotes] = await Promise.all([
        database.vote.count({
          where: { challengeId: entityId, voteType: "upvote" },
        }),
        database.vote.count({
          where: { challengeId: entityId, voteType: "downvote" },
        }),
      ]);
    } else if (entityType === "solution") {
      [upvotes, downvotes] = await Promise.all([
        database.vote.count({
          where: { solutionId: entityId, voteType: "upvote" },
        }),
        database.vote.count({
          where: { solutionId: entityId, voteType: "downvote" },
        }),
      ]);
    } else if (entityType === "comment") {
      [upvotes, downvotes] = await Promise.all([
        database.vote.count({
          where: { commentId: entityId, voteType: "upvote" },
        }),
        database.vote.count({
          where: { commentId: entityId, voteType: "downvote" },
        }),
      ]);
    }

    return NextResponse.json({
      upvotesCount: upvotes,
      downvotesCount: downvotes,
      totalVotes: upvotes + downvotes,
      score: upvotes - downvotes,
    });
  } catch (error) {
    console.error("Error fetching vote stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch vote stats" },
      { status: 500 }
    );
  }
}



