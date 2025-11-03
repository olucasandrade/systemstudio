import { auth, clerkClient } from "@/app/auth/server";
import { database } from "@/app/database";
import { NextRequest, NextResponse } from "next/server";

// POST /api/solutions/challenge/:challengeId - Create a solution
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ challengeId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { challengeId } = await params;
    const body = await request.json();
    const { description, canvasData } = body;

    // Debug logging
    console.log("Creating solution with canvas data:", {
      challengeId,
      description: description?.substring(0, 50) + "...",
      hasCanvasData: !!canvasData,
      canvasDataType: typeof canvasData,
      canvasDataKeys: canvasData ? Object.keys(canvasData) : null,
    });

    if (!description) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    // Verify challenge exists
    const challenge = await database.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    // Check canvas data size (limit to 1MB)
    if (canvasData && JSON.stringify(canvasData).length > 1_000_000) {
      return NextResponse.json(
        { error: "Canvas data is too large (max 1MB)" },
        { status: 400 }
      );
    }

    const solution = await database.solution.create({
      data: {
        challengeId,
        userId,
        description,
        canvasData: canvasData || null,
      },
    });

    // Return solution with canvas data included
    return NextResponse.json({
      ...solution,
      canvasData: solution.canvasData,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating solution:", error);
    return NextResponse.json(
      { error: "Failed to create solution" },
      { status: 500 }
    );
  }
}

// GET /api/solutions/challenge/:challengeId - Get solutions for a challenge
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ challengeId: string }> }
) {
  try {
    const { challengeId } = await params;
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "20", 10);
    const sortBy = searchParams.get("sortBy") || "newest"; // 'newest', 'top'

    const skip = (page - 1) * pageSize;

    const orderBy =
      sortBy === "top"
        ? { upvotesCount: "desc" as const }
        : { createdAt: "desc" as const };

    const [solutions, total] = await Promise.all([
      database.solution.findMany({
        where: { challengeId },
        skip,
        take: pageSize,
        orderBy,
        include: {
          _count: {
            select: { comments: true },
          },
        },
      }),
      database.solution.count({ where: { challengeId } }),
    ]);

    // Fetch user data from Clerk
    const userIds = [...new Set(solutions.map((s) => s.userId))];
    const client = await clerkClient();
    const users = await Promise.all(
      userIds.map((id) => client.users.getUser(id).catch(() => null))
    );
    
    const userMap = new Map(
      users.filter(Boolean).map((user) => [
        user!.id,
        {
          firstName: user!.firstName,
          lastName: user!.lastName,
          imageUrl: user!.imageUrl,
        },
      ])
    );

    return NextResponse.json({
      data: solutions.map((sol) => ({
        ...sol,
        commentsCount: sol._count.comments,
        user: userMap.get(sol.userId) || null,
        // Ensure canvasData is included in response
        canvasData: sol.canvasData,
      })),
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching solutions:", error);
    return NextResponse.json(
      { error: "Failed to fetch solutions" },
      { status: 500 }
    );
  }
}

