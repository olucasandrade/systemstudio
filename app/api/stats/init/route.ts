import { auth } from "@/app/auth/server";
import { database } from "@/app/database";
import { NextRequest, NextResponse } from "next/server";

// POST /api/stats/init - Initialize leaderboard data
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Initializing leaderboard data...");

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

    console.log(`Found ${allUserIds.size} users with activity`);

    let updatedCount = 0;

    // Calculate stats for each user
    for (const userId of allUserIds) {
      try {
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
        const score = (solutionsCount * 10) + (commentsCount * 3) + upvotesReceived;

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

        updatedCount++;
        console.log(`Updated stats for user ${userId}: ${score} points`);
      } catch (error) {
        console.error(`Failed to calculate stats for user ${userId}:`, error);
      }
    }

    console.log(`Leaderboard initialization complete! Updated ${updatedCount} users.`);

    return NextResponse.json({ 
      success: true, 
      updated: updatedCount,
      message: `Updated stats for ${updatedCount} users`
    });
  } catch (error) {
    console.error("Error initializing leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to initialize leaderboard" },
      { status: 500 }
    );
  }
}

