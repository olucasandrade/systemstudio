import { auth } from "@/app/auth/server";
import { database } from "@/app/database";
import { clerkClient } from "@/app/auth/server";
import { NextRequest, NextResponse } from "next/server";

// POST /api/stats/calculate-all - Calculate stats for all users (admin only)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all users who have solutions, comments, or votes
    const [usersWithSolutions, usersWithComments, usersWithVotes] = await Promise.all([
      database.solution.findMany({
        select: { userId: true },
        distinct: ['userId'],
      }),
      database.comment.findMany({
        select: { userId: true },
        distinct: ['userId'],
      }),
      database.vote.findMany({
        select: { userId: true },
        distinct: ['userId'],
      }),
    ]);

    const allUserIds = new Set([
      ...usersWithSolutions.map(s => s.userId),
      ...usersWithComments.map(c => c.userId),
      ...usersWithVotes.map(v => v.userId),
    ]);

    // Calculate stats for each user
    const statsPromises = Array.from(allUserIds).map(async (userId) => {
      try {
        const [solutions, comments, votes] = await Promise.all([
          database.solution.findMany({
            where: { userId },
            select: { id: true, upvotesCount: true, downvotesCount: true },
          }),
          database.comment.findMany({
            where: { userId },
            select: { id: true, upvotesCount: true, downvotesCount: true },
          }),
          database.vote.findMany({
            where: { userId, voteType: "upvote" },
            select: { id: true },
          }),
        ]);

        const solutionsCount = solutions.length;
        const commentsCount = comments.length;
        const upvotesGiven = votes.length;
        
        const solutionsUpvotes = solutions.reduce((sum, s) => sum + s.upvotesCount, 0);
        const commentsUpvotes = comments.reduce((sum, c) => sum + c.upvotesCount, 0);
        const upvotesReceived = solutionsUpvotes + commentsUpvotes;

        const score = (solutionsCount * 10) + (commentsCount * 3) + upvotesReceived;

        return {
          userId,
          score,
          solutionsCount,
          commentsCount,
          upvotesGiven,
          upvotesReceived,
        };
      } catch (error) {
        console.error(`Failed to calculate stats for user ${userId}:`, error);
        return null;
      }
    });

    const stats = (await Promise.all(statsPromises)).filter(Boolean);

    // Batch update all stats
    const updatePromises = stats.map(stat => 
      database.userStats.upsert({
        where: { userId: stat!.userId },
        update: {
          score: stat!.score,
          solutionsCount: stat!.solutionsCount,
          commentsCount: stat!.commentsCount,
          upvotesGiven: stat!.upvotesGiven,
          upvotesReceived: stat!.upvotesReceived,
        },
        create: {
          userId: stat!.userId,
          score: stat!.score,
          solutionsCount: stat!.solutionsCount,
          commentsCount: stat!.commentsCount,
          upvotesGiven: stat!.upvotesGiven,
          upvotesReceived: stat!.upvotesReceived,
        },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ 
      success: true, 
      updated: stats.length 
    });
  } catch (error) {
    console.error("Error calculating all user stats:", error);
    return NextResponse.json(
      { error: "Failed to calculate stats" },
      { status: 500 }
    );
    }
}

