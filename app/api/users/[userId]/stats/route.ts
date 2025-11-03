import { database } from "@/app/database";
import { NextRequest, NextResponse } from "next/server";

// GET /api/users/:userId/stats - Get user statistics and score
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Get or create user stats
    let stats = await database.userStats.findUnique({
      where: { userId },
    });

    // If stats don't exist, calculate and create them
    if (!stats) {
      const [solutions, comments, votesGiven, solutionUpvotes, commentUpvotes] = await Promise.all([
        database.solution.count({ where: { userId } }),
        database.comment.count({ where: { userId } }),
        database.vote.count({ where: { userId, voteType: "upvote" } }),
        database.solution.aggregate({
          where: { userId },
          _sum: { upvotesCount: true },
        }),
        database.comment.aggregate({
          where: { userId },
          _sum: { upvotesCount: true },
        }),
      ]);

      const upvotesReceived = 
        (solutionUpvotes._sum.upvotesCount || 0) + 
        (commentUpvotes._sum.upvotesCount || 0);

      // Calculate score: 
      // - 10 points per solution
      // - 2 points per comment
      // - 1 point per upvote given
      // - 5 points per upvote received
      const score = 
        (solutions * 10) + 
        (comments * 2) + 
        votesGiven + 
        (upvotesReceived * 5);

      stats = await database.userStats.create({
        data: {
          userId,
          score,
          solutionsCount: solutions,
          commentsCount: comments,
          upvotesGiven: votesGiven,
          upvotesReceived,
        },
      });
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    );
  }
}

// POST /api/users/:userId/stats/recalculate - Recalculate user stats
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const [solutions, comments, votesGiven, solutionUpvotes, commentUpvotes] = await Promise.all([
      database.solution.count({ where: { userId } }),
      database.comment.count({ where: { userId } }),
      database.vote.count({ where: { userId, voteType: "upvote" } }),
      database.solution.aggregate({
        where: { userId },
        _sum: { upvotesCount: true },
      }),
      database.comment.aggregate({
        where: { userId },
        _sum: { upvotesCount: true },
      }),
    ]);

    const upvotesReceived = 
      (solutionUpvotes._sum.upvotesCount || 0) + 
      (commentUpvotes._sum.upvotesCount || 0);

    const score = 
      (solutions * 10) + 
      (comments * 2) + 
      votesGiven + 
      (upvotesReceived * 5);

    const stats = await database.userStats.upsert({
      where: { userId },
      update: {
        score,
        solutionsCount: solutions,
        commentsCount: comments,
        upvotesGiven: votesGiven,
        upvotesReceived,
      },
      create: {
        userId,
        score,
        solutionsCount: solutions,
        commentsCount: comments,
        upvotesGiven: votesGiven,
        upvotesReceived,
      },
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error recalculating user stats:", error);
    return NextResponse.json(
      { error: "Failed to recalculate user stats" },
      { status: 500 }
    );
  }
}




