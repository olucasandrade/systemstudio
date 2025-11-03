import { database } from "@/app/database";
import { clerkClient } from "@/app/auth/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/community/stats - Get community statistics
export async function GET(request: NextRequest) {
  try {
    const [totalSolutions, totalComments, totalChallenges] = await Promise.all([
      database.solution.count(),
      database.comment.count(),
      database.challenge.count(),
    ]);

    const totalUsers = await (await clerkClient()).users.getCount();

    return NextResponse.json({
      totalUsers,
      totalSolutions,
      totalComments,
      totalChallenges,
    });
  } catch (error) {
    console.error("Error fetching community stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch community stats" },
      { status: 500 }
    );
  }
}
