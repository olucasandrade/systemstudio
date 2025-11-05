import { auth } from "@/app/auth/server";
import { database } from "@/app/database";
import { NextRequest, NextResponse } from "next/server";

// GET /api/votes/user-vote/:entityType/:entityId - Get current user's vote for an entity
export async function GET(
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

    let vote;
    if (entityType === "challenge") {
      vote = await database.vote.findUnique({
        where: {
          userId_challengeId: {
            userId,
            challengeId: entityId,
          },
        },
      });
    } else if (entityType === "solution") {
      vote = await database.vote.findUnique({
        where: {
          userId_solutionId: {
            userId,
            solutionId: entityId,
          },
        },
      });
    } else if (entityType === "comment") {
      vote = await database.vote.findUnique({
        where: {
          userId_commentId: {
            userId,
            commentId: entityId,
          },
        },
      });
    }

    if (!vote) {
      return NextResponse.json({ userVote: null });
    }

    return NextResponse.json({ userVote: vote.voteType });
  } catch (error) {
    console.error("Error fetching user vote:", error);
    return NextResponse.json(
      { error: "Failed to fetch user vote" },
      { status: 500 }
    );
  }
}



