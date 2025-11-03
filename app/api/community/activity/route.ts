import { database } from "@/app/database";
import { clerkClient } from "@/app/auth/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/community/activity - Get recent community activity
export async function GET(request: NextRequest) {
  try {
    const recentSolutions = await database.solution.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        challenge: {
          select: {
            id: true,
            title: true,
            difficulty: true,
          },
        },
      },
    });

    const recentComments = await database.comment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        solution: {
          include: {
            challenge: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    // Fetch user data
    const client = await clerkClient();
    const solutionsWithUsers = await Promise.all(
      recentSolutions.map(async (solution) => {
        try {
          const user = await client.users.getUser(solution.userId);
          return {
            ...solution,
            user: {
              firstName: user.firstName,
              lastName: user.lastName,
              imageUrl: user.imageUrl,
            },
          };
        } catch {
          return {
            ...solution,
            user: null,
          };
        }
      })
    );

    const commentsWithUsers = await Promise.all(
      recentComments.map(async (comment) => {
        try {
          const user = await client.users.getUser(comment.userId);
          return {
            ...comment,
            user: {
              firstName: user.firstName,
              lastName: user.lastName,
              imageUrl: user.imageUrl,
            },
          };
        } catch {
          return {
            ...comment,
            user: null,
          };
        }
      })
    );

    return NextResponse.json({
      recentSolutions: solutionsWithUsers,
      recentComments: commentsWithUsers,
    });
  } catch (error) {
    console.error("Error fetching community activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch community activity" },
      { status: 500 }
    );
  }
}
