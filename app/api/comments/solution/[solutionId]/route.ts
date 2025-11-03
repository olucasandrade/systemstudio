import { auth, clerkClient } from "@/app/auth/server";
import { database } from "@/app/database";
import { NextRequest, NextResponse } from "next/server";

// POST /api/comments/solution/:solutionId - Create a comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ solutionId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { solutionId } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Verify solution exists
    const solution = await database.solution.findUnique({
      where: { id: solutionId },
    });

    if (!solution) {
      return NextResponse.json(
        { error: "Solution not found" },
        { status: 404 }
      );
    }

    const comment = await database.comment.create({
      data: {
        solutionId,
        userId,
        content,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

// GET /api/comments/solution/:solutionId - Get comments for a solution
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ solutionId: string }> }
) {
  try {
    const { solutionId } = await params;
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "20", 10);

    const skip = (page - 1) * pageSize;

    const [comments, total] = await Promise.all([
      database.comment.findMany({
        where: { solutionId },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      database.comment.count({ where: { solutionId } }),
    ]);

    // Fetch user data from Clerk
    const userIds = [...new Set(comments.map((c) => c.userId))];
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

    const commentsWithUsers = comments.map((comment) => ({
      ...comment,
      user: userMap.get(comment.userId) || null,
    }));

    return NextResponse.json({
      data: commentsWithUsers,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

