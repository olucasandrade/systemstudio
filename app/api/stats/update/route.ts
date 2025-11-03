import { auth } from "@/app/auth/server";
import { database } from "@/app/database";
import { NextRequest, NextResponse } from "next/server";

// POST /api/stats/update - Update user stats
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use more efficient aggregation queries
    const [solutionsCount, commentsCount, upvotesGiven, solutionsUpvotes, commentsUpvotes] = await Promise.all([
      database.solution.count({ where: { userId } }),
      database.comment.count({ where: { userId } }),
      database.vote.count({ where: { userId, voteType: "upvote" } }),
      database.solution.aggregate({
        where: { userId },
        _sum: { upvotesCount: true },
      }).then(result => result._sum.upvotesCount || 0),
      database.comment.aggregate({
        where: { userId },
        _sum: { upvotesCount: true },
      }).then(result => result._sum.upvotesCount || 0),
    ]);

    const upvotesReceived = solutionsUpvotes + commentsUpvotes;

    // Calculate total score: 10 points per solution + 3 points per comment + 1 point per upvote received
    const score = (solutionsCount * 10) + (commentsCount * 3) + upvotesReceived;

    // Upsert user stats
    await database.userStats.upsert({
      where: { userId },
      update: {
        score,
        solutionsCount,
        commentsCount,
        upvotesGiven,
        upvotesReceived,
      },
      create: {
        userId,
        score,
        solutionsCount,
        commentsCount,
        upvotesGiven,
        upvotesReceived,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user stats:", error);
    return NextResponse.json(
      { error: "Failed to update stats" },
      { status: 500 }
    );
  }
}
