import { database } from "@/app/database";
import { clerkClient } from "@/app/auth/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/leaderboard - Get leaderboard data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get("limit") || "50", 10);

    const userStats = await database.userStats.findMany({
      orderBy: { score: "desc" },
      take: limit,
    });

    console.log("Found user stats:", userStats.length);

    if (userStats.length === 0) {
      console.log("No user stats found in database");
      return NextResponse.json({ data: [] });
    }

    const client = await clerkClient();
    
    const usersWithData = await Promise.all(
      userStats.map(async (stat) => {
        try {
          const user = await client.users.getUser(stat.userId);
          return {
            ...stat,
            user: {
              firstName: user.firstName,
              lastName: user.lastName,
              imageUrl: user.imageUrl,
            },
          };
        } catch (error) {
          console.error(`Failed to fetch user ${stat.userId}:`, error);
          return {
            ...stat,
            user: {
              firstName: "User",
              lastName: "",
              imageUrl: "",
            },
          };
        }
      })
    );

    return NextResponse.json({ data: usersWithData });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
